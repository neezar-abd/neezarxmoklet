import { NextApiRequest, NextApiResponse } from 'next';

let guestbookEntries: { name: string; message: string }[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(guestbookEntries);
    } else if (req.method === 'POST') {
        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }

        const newEntry = { name, message };
        guestbookEntries.push(newEntry);
        res.status(201).json(newEntry);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}