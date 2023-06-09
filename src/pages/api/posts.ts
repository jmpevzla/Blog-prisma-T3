import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(403).send("Unauthorized");
  }

  const id = session.user.id;

  if (req.method === "POST") {
    await prisma.posts.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        title: req.body.title,
        authorId: id,
      },
    });

    return res.status(200).json({ error: null });
  }

  if (req.method === "DELETE") {
    await prisma.posts.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: req.query.id as string,
      },
    });

    return res.status(204).end();
  }

  return res.send("Method not allowed.");
}
