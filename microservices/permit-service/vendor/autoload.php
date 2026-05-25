<?php
// Shared-vendor shim.
// ob_start() captures any notices/warnings emitted during autoloader setup
// so nothing leaks to stdout before Laravel can send HTTP headers.
ob_start();

$serviceRoot = dirname(__DIR__);
$sharedVendor = dirname($serviceRoot) . '/shared-vendor';

$loader = require $sharedVendor . '/autoload.php';

// Prepend our handler so it runs before Composer's classmap,
// which has stale App\ paths pointing to the wrong service directory.
spl_autoload_register(function (string $class) use ($serviceRoot): bool {
    static $map = [
        'App\\'                 => '/app/',
        'Database\\Factories\\' => '/database/factories/',
        'Database\\Seeders\\'   => '/database/seeders/',
    ];
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
}, true, true); // prepend=true → runs before Composer classmap

ob_end_clean(); // discard any bootstrap output before headers are sent

return $loader;
