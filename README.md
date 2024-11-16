<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment</title>
</head>
<body>
    <h1>Payment Page</h1>
    <form action="/pay" method="POST">
        <script src="https://js.stripe.com/v3/"></script>
        <div id="payment-form"></div>
        <button type="submit">Pay</button>
    </form>
</body>
</html>
