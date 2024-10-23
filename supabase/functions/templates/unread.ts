export const getUnreadEmail = (sender: string, link: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Message Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #FFFFFF;
            color: #222222;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #FFFFFF;
            border: 1px solid #ECF0F3;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #5C59E4;
            color: #FFFFFF;
            padding: 15px;
            text-align: center;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .button {
            background-color: #5C59E4;
            color: #FFFFFF;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
        }
        .button:hover {
            background-color: #4543AB;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9CABC2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div>
            <div class="header">
                <h1>New Message from ${sender}</h1>
            </div>
            <div class="content">
                <p>You have received a new message from ${sender}. Click the button below to view the message.</p>
                <a href="${link}" class="button">View Message</a>
            </div>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at feedback@moneyfitt.co.</p>
        </div>
    </div>
</body>
</html>
`;
