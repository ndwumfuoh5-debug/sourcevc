"use client";

import { ExternalLink, HeartPulse } from "lucide-react";
import Link from "next/link";
import { authClient, getAuthActiveOrganization, getAuthClient } from "@/client-lib/auth-client";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <header className="fixed top-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-b border-border/60 z-[10] h-12">
      <div className="mx-auto h-full px-6">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-primary">
              <HeartPulse className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">Healthworx</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {session.user.name?.[0]?.toUpperCase() ?? session.user.email?.[0]?.toUpperCase()}
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
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_VYBE_BASE_URL}/organizations`, "_blank")}
                  >
                    Switch organization <ExternalLink className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_VYBE_BASE_URL}/apps`, "_blank")}
                  >
                    Manage apps <ExternalLink className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={true} className="cursor-pointer" onClick={handleSignOut}>
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
