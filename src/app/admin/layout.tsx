import { auth } from "@/auth";
import { error, isAdmin } from "@/lib/utils";

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) return error("You must be signed in to view this page.", "/");
  else if (!isAdmin(session)) return error("You must be an admin to view this page.", "/");

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-10 px-4 py-28 md:px-8 md:py-32">
      {children}
    </div>
  );
}

export default AdminLayout;
