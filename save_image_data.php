<?php
header('Content-Type: application/json');

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    if (isset($_POST['imageBoxesData'])) {
        $data = json_decode($_POST['imageBoxesData'], true);
    }
}

// Validate data
if (!is_array($data)) {
    die(json_encode(['error' => 'Invalid data format']));
}

// Process image data (handle base64 encoded images)
$processedData = array_map(function($item) {
    if (isset($item['imageUrl']) && strpos($item['imageUrl'], 'data:image') === 0) {
        // Handle base64 image upload
        $imageData = $item['imageUrl'];
        $folderPath = 'uploads/';
        if (!file_exists($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
        
        list($type, $data) = explode(';', $imageData);
        list(, $data) = explode(',', $data);
        $data = base64_decode($data);
        
        $extension = str_replace('image/', '', str_replace('data:', '', $type));
        $filename = 'img_' . md5(uniqid()) . '.' . $extension;
        $filePath = $folderPath . $filename;
        
        if (file_put_contents($filePath, $data)) {
            $item['imageUrl'] = $filePath;
        } else {
            $item['imageUrl'] = '';
        }
    }
    return $item;
}, $data);

// Save to file
$result = file_put_contents('image_data.json', json_encode($processedData));

if ($result === false) {
    die(json_encode(['error' => 'Failed to save data']));
}

echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
?>