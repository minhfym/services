<?php
// Shared-vendor shim: one vendor folder for all 8 microservices.
// Load shared vendor first (registers itself with prepend=true),
// then prepend our App\ handler so it sits in front of the classmap.

$serviceRoot = dirname(__DIR__);
$sharedVendor = dirname($serviceRoot) . '/shared-vendor';

$loader = require $sharedVendor . '/autoload.php';

// prepend=true ensures we run before Composer's classmap lookup
@spl_autoload_register(function (string $class) use ($serviceRoot): bool {
    static $map = null;
    if ($map === null) {
        $map = [
            'App\\'                 => '/app/',
            'Database\\Factories\\' => '/database/factories/',
            'Database\\Seeders\\'   => '/database/seeders/',
        ];
    }
    foreach ($map as $prefix => $rel) {
        if (strncmp($prefix, $class, $len = strlen($prefix)) !== 0) {
            continue;
        }
        $file = $serviceRoot . $rel . str_replace('\\', '/', substr($class, $len)) . '.php';
        if (file_exists($file)) {
            require $file;
            return true;
        }
    }
    return false;
}, true, true);

return $loader;
