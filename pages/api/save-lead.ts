// pages/api/save-lead.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, email } = req.body;

  if (
    !url ||
    !email ||
    typeof url !== 'string' ||
    typeof email !== 'string' ||
    !email.includes('@') ||
    !email.includes('.')
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'Missing client ID' });
  }

  try {
    const leadsRef = collection(db, 'clients', clientId, 'leads');
    await addDoc(leadsRef, {
      email,
      url,
      clientId, // <- Add this so collectionGroup filtering works
      createdAt: Timestamp.now(),
    });
    res.status(200).json({ message: 'Lead saved successfully' });
  } catch (error: any) {
    // SaveLead failed
    res.status(500).json({ error: 'Failed to save lead' });
  }
}
