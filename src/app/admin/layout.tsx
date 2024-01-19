import { getSession, isAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";

async function PageLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        return redirect("/?error=You must be logged in to view this page.");
    }

    if (!isAdmin(session)) {
        return redirect("/?error=You do not have permission to view this page.");
    }

    return (
        <div className="mx-auto flex flex-col items-center min-h-screen gap-10 px-4 md:px-8 py-28 md:py-32 max-w-7xl">
            {children}
        </div>
    )
}

export default PageLayout;
