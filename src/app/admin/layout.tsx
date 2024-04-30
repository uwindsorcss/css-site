import { auth } from "@/auth";
import { error, isAdmin } from "@/lib/utils";

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) return error("You must be signed in to view this page.", "/");
  else if (!isAdmin(session)) return error("You must be an admin to view this page.", "/");

  return (
    <div className="mx-auto flex flex-col items-center min-h-screen gap-10 px-4 md:px-8 py-28 md:py-32 max-w-7xl">
      {children}
    </div>
  );
}

export default AdminLayout;
