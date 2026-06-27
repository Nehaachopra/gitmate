import Image from "next/image";
import Link from "next/link";

import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { SidebarUserButton } from "@/features/dashboard/components/sidebar-user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { UserMenuUser } from "@/features/auth/components/user-menu";

type DashboardSidebarProps = {
  user: UserMenuUser;
  plan?: string;
};

export function DashboardSidebar({
  user,
  plan = "Pro",
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="ChaiCodeAIReview" asChild>
              <Link
                href={DASHBOARD_ROUTES.overview}
                className="flex items-center gap-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-none bg-sidebar">
                  <Image
                    src="/images/logo.png"
                    alt=""
                    width={55}
                    height={55}
                    className="object-contain"
                  />
                </span>
                <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">
                    Git mate
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
