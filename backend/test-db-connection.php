<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "Testing Database Connection...\n";
echo "Host: " . config('database.connections.mysql.host') . "\n";
echo "Database: " . config('database.connections.mysql.database') . "\n";
echo "Username: " . config('database.connections.mysql.username') . "\n";
echo "\n";

try {
    $pdo = DB::connection()->getPdo();
    echo "✅ SUCCESS! Database connection established.\n";
    echo "Server version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n";
    
    // Check if tables exist
    $tables = DB::select('SHOW TABLES');
    echo "\nFound " . count($tables) . " tables in database.\n";
    
    if (count($tables) > 0) {
        echo "\nTables:\n";
        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            echo "  - $tableName\n";
        }
    } else {
        echo "\n⚠️  No tables found. You need to import g_universitaire.sql via phpMyAdmin.\n";
    }
    
} catch (Exception $e) {
    echo "❌ FAILED! Connection error:\n";
    echo $e->getMessage() . "\n";
    echo "\nPossible solutions:\n";
    echo "1. Check your internet connection\n";
    echo "2. Verify credentials in .env file\n";
    echo "3. Ensure FreeSQLDatabase allows your IP\n";
    echo "4. Import g_universitaire.sql via phpMyAdmin first\n";
}
