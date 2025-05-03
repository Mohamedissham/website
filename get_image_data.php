<?php
header('Content-Type: application/json');

// Set cache control headers
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

// Check if file exists or create default data
$filePath = 'image_data.json';
if (!file_exists($filePath)) {
    $defaultData = [
        [
            "imageUrl" => "assets/malaysia.jpeg",
            "title" => "Instant Transfers",
            "description" => "Send money to your loved ones in minutes",
            "isNew" => false
        ],
        [
            "imageUrl" => "assets/thailand.jpeg",
            "title" => "Bank-Level Security",
            "description" => "Your money and data are always protected",
            "isNew" => false
        ],
        [
            "imageUrl" => "assets/nepa1.jpg",
            "title" => "Competitive Rates",
            "description" => "More money reaches your family",
            "isNew" => false
        ]
    ];
    file_put_contents($filePath, json_encode($defaultData));
}

// Read and return the file contents
$data = file_get_contents($filePath);
if ($data === false) {
    die(json_encode(['error' => 'Failed to read data']));
}

echo $data;
?>