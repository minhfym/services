<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class GatewayController extends Controller
{
    private Client $client;

    private array $serviceMap = [
        'auth'               => 'http://localhost:8001',
        'taxes'              => 'http://localhost:8002',
        'permits'            => 'http://localhost:8003',
        'lands'              => 'http://localhost:8004',
        'grants'             => 'http://localhost:8005',
        'grant-applications' => 'http://localhost:8005',
        'cases'              => 'http://localhost:8006',
        'registrations'      => 'http://localhost:8007',
    ];

    public function __construct()
    {
        $this->client = new Client(['timeout' => 30, 'http_errors' => false]);
    }

    public function handle(Request $request, string $service, string $path = '')
    {
        if (!isset($this->serviceMap[$service])) {
            return response()->json(['error' => 'Service not found', 'available_services' => array_keys($this->serviceMap)], 404);
        }

        $baseUrl = $this->serviceMap[$service];
        $targetUrl = $baseUrl . '/api/' . $service . ($path ? '/' . $path : '');
        $queryString = $request->getQueryString();
        if ($queryString) {
            $targetUrl .= '?' . $queryString;
        }

        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-Forwarded-For' => $request->ip(),
        ];

        if ($request->bearerToken()) {
            $headers['Authorization'] = 'Bearer ' . $request->bearerToken();
        }

        try {
            $body = $request->all();
            $options = ['headers' => $headers];
            if (!empty($body) && in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
                $options['json'] = $body;
            }

            $response = $this->client->request(
                $request->method(),
                $targetUrl,
                $options
            );

            $responseBody = (string) $response->getBody();
            $statusCode = $response->getStatusCode();

            return response($responseBody, $statusCode)
                ->header('Content-Type', 'application/json')
                ->header('X-Service', $service)
                ->header('X-Gateway', 'gov-portal-gateway');
        } catch (RequestException $e) {
            return response()->json([
                'error' => 'Service unavailable',
                'service' => $service,
                'message' => $e->getMessage(),
            ], 503);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gateway error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function dashboard(Request $request)
    {
        $results = [];
        $services = [
            'taxes'         => 'http://localhost:8002/api/taxes/stats',
            'permits'       => 'http://localhost:8003/api/permits/stats',
            'lands'         => 'http://localhost:8004/api/lands/stats',
            'grants'        => 'http://localhost:8005/api/grants/stats',
            'cases'         => 'http://localhost:8006/api/cases/stats',
            'registrations' => 'http://localhost:8007/api/registrations/stats',
        ];

        foreach ($services as $key => $url) {
            try {
                $response = $this->client->get($url, [
                    'timeout' => 5,
                    'http_errors' => false,
                    'headers' => ['Accept' => 'application/json'],
                ]);
                $results[$key] = json_decode((string) $response->getBody(), true) ?? [];
            } catch (\Exception $e) {
                $results[$key] = ['error' => 'unavailable'];
            }
        }

        return response()->json([
            'total_tax_collections'   => $results['taxes']['total_collected'] ?? 0,
            'active_permits'          => $results['permits']['active_count'] ?? 0,
            'registered_lands'        => $results['lands']['total_count'] ?? 0,
            'open_cases'              => $results['cases']['open_count'] ?? 0,
            'grant_applications'      => $results['grants']['applications_count'] ?? 0,
            'pending_registrations'   => $results['registrations']['pending_count'] ?? 0,
            'service_stats'           => $results,
            'generated_at'            => now()->toISOString(),
        ]);
    }

    public function health()
    {
        $health = [];
        $allHealthy = true;

        foreach ($this->serviceMap as $service => $url) {
            try {
                $response = $this->client->get($url . '/up', [
                    'timeout' => 3,
                    'http_errors' => false,
                ]);
                $isUp = $response->getStatusCode() === 200;
                $health[$service] = ['status' => $isUp ? 'up' : 'degraded', 'port' => parse_url($url, PHP_URL_PORT)];
                if (!$isUp) $allHealthy = false;
            } catch (\Exception $e) {
                $health[$service] = ['status' => 'down', 'port' => parse_url($url, PHP_URL_PORT)];
                $allHealthy = false;
            }
        }

        return response()->json([
            'gateway' => 'up',
            'overall' => $allHealthy ? 'healthy' : 'degraded',
            'services' => $health,
            'checked_at' => now()->toISOString(),
        ], $allHealthy ? 200 : 207);
    }
}
