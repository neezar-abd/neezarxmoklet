import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Here you would typically handle the form submission,
        // such as sending an email or saving to a database.

        // For demonstration, we'll just return a success response.
        return res.status(200).json({ message: 'Message sent successfully!' });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}