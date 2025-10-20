export default async function handler(req: any, res: any) {
  res.status(200).json({ ok: true, msg: 'Hello from Node 20' });
}
