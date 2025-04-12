import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Corrija o caminho de importação

export const dynamic = "force-dynamic"; // Recomendado para rotas de auth

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };