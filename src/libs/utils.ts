import axios from "axios"

export function sendMessage(data: any) {
    return axios(
        {
            method: 'POST',
            url: `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: data
        })
}

export function getTextMessageInput(recepient: string, text: string) {
    return JSON.stringify({
        "messaging_product": "whatsapp",    
        "preview_url": false,
        "recipient_type": "individual",
        "to": recepient,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": "text-message-content"
        }
    })
}