<?php

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$phone = $data['phone'];
$wilaya = $data['wilaya'];
$delivery = $data['delivery'];

/* هنا تجيبي cart من table cart */
$result = mysqli_query($conn, "SELECT * FROM cart");

$products = [];
$total = 0;

while($row = mysqli_fetch_assoc($result)){
    $products[] = $row;
    $total += $row['price'];
}

$products_json = json_encode($products);

/* insert order */
mysqli_query($conn,
"INSERT INTO orders(fullname, phone, wilaya, delivery, products, total)
VALUES('$name','$phone','$wilaya','$delivery','$products_json','$total')");

/* empty cart after order */
mysqli_query($conn, "DELETE FROM cart");

echo json_encode(["success"=>true]);

?>