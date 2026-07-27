"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { authClient, getAuthActiveOrganization, getAuthClient } from "@/client-lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { data: session } = getAuthClient();
  const { data: activeOrganization } = getAuthActiveOrganization();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = `${process.env.NEXT_PUBLIC_VYBE_BASE_URL}/login`;
        },
      },
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white border-b" style={{ borderColor: "rgba(139,69,19,0.1)" }}>
      <div className="mx-auto h-full px-6">
        <div className="flex justify-between items-center h-full">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#D4A06A" }}
              aria-hidden="true"
            />
            <span
              className="text-sm font-semibold tracking-[0.18em] uppercase"
              style={{ color: "#1C0F07" }}
            >
              Dashboard
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{ background: "rgba(92,45,18,0.1)", color: "#5C2D12" }}
                    >
                      {session.user.name?.[0]?.toUpperCase() ??
                        session.user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name ?? "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Organization</p>
                    <p className="text-sm text-foreground">
                      {activeOrganization?.name ?? "No organization selected"}
                    </p>
                  </div>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_VYBE_BASE_URL}/organizations`,
                        "_blank",
                      )
                    }
                  >
                    Switch organization <ExternalLink className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      window.open(`${process.env.NEXT_PUBLIC_VYBE_BASE_URL}/apps`, "_blank")
                    }
                  >
                    Manage apps <ExternalLink className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={true}
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <span className="text-destructive font-semibold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
