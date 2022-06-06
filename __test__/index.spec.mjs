import test from 'ava'
import { get } from 'https'

import { nativeCerts } from '../index.js'

// Promise-ify https.get
async function pget(params) {
    return new Promise((resolve, reject) => {
        const request = get(params, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
    })
}

test('HTTPS request uses native certs', async (t) => {
    const ca = nativeCerts()
    t.not(ca.length, 0)
    
    let responseBody = await pget({ca, host: "example.com", path: "/"})

    t.not(responseBody.length, 0)
})
