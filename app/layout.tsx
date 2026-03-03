import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MapProvider } from "./components/Map/MapProvider";

export const metadata: Metadata = {
  title: "Terra Logger",
  description: "Geospatial planning tool for offgrid cabin layouts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <MapProvider>
            <AppSidebar />
            <SidebarInset>
              <ErrorBoundary>
                <div className="flex-1 h-full relative">
                  {children}
                </div>
              </ErrorBoundary>
            </SidebarInset>
          </MapProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
