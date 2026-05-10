import { useState } from "react"
import { ChevronRightIcon, FileIcon, FolderIcon, PanelLeftIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import FindInSortedArray from "@/pages/BinarySearch/FindInSortedArray"
import LongestUniqueSubstring from "@/pages/LongestUniqueSubstring"

type FileItem  = { name: string; component: React.ReactNode }
type FolderItem = { name: string; items: FileItem[] }
type FileTreeItem = FileItem | FolderItem

type Props = {
    setSelectedComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>
}

export function AppSidebar({ setSelectedComponent }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeFile, setActiveFile] = useState<string | null>(null)

    const fileTree: FileTreeItem[] = [
        {
            name: "Binary Search",
            items: [{ name: "FindInSortedArray.tsx", component: <FindInSortedArray /> }],
        },
        {
            name: "Sliding Window",
            items: [{ name: "LongestUniqueSubstring.tsx", component: <LongestUniqueSubstring /> }],
        },
    ]

    const handleSelect = (name: string, component: React.ReactNode) => {
        setActiveFile(name)
        setSelectedComponent(component)
        setMobileOpen(false)
    }

    const renderItem = (item: FileTreeItem, depth = 0) => {
        if ("items" in item) {
            return (
                <Collapsible key={item.name} defaultOpen>
                    <CollapsibleTrigger asChild>
                        <button className={cn(
                            "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                            "text-muted-foreground hover:text-foreground hover:bg-muted",
                            "transition-colors duration-100",
                        )}>
                            <ChevronRightIcon
                                size={13}
                                className="shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-90"
                            />
                            <FolderIcon size={13} className="shrink-0 opacity-60" />
                            <span className="truncate font-medium">{item.name}</span>
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="ml-3 mt-0.5 flex flex-col border-l border-border pl-2">
                            {item.items.map((child) => renderItem(child, depth + 1))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        }

        // File leaf
        const isActive = activeFile === item.name
        return (
            <button
                key={item.name}
                onClick={() => handleSelect(item.name, item.component)}
                className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    "transition-colors duration-100 text-left",
                    isActive
                        ? "bg-accent/15 text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
            >
                <FileIcon size={13} className="shrink-0 opacity-60" />
                <span className="truncate" style={{ fontFamily: "var(--mono)", fontSize: "12px" }}>
                    {item.name}
                </span>
                {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: "var(--accent)" }} />
                )}
            </button>
        )
    }

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>
                    Explorer
                </span>
                {/* Close button — mobile only */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden rounded p-1 hover:bg-muted transition-colors"
                    aria-label="Close sidebar"
                >
                    <XIcon size={14} className="text-muted-foreground" />
                </button>
            </div>

            {/* Tree */}
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-0.5 p-2">
                    {fileTree.map((item) => renderItem(item))}
                </div>
            </ScrollArea>
        </div>
    )

    return (
        <>
            {/* ── Mobile toggle button (shown when sidebar is closed) ── */}
            {!mobileOpen && (
                <button
                    onClick={() => setMobileOpen(true)}
                    className={cn(
                        "fixed bottom-4 left-4 z-50 md:hidden",
                        "flex items-center justify-center rounded-full w-10 h-10",
                        "shadow-lg transition-all duration-200",
                    )}
                    style={{ background: "var(--accent)", color: "#fff" }}
                    aria-label="Open sidebar"
                >
                    <PanelLeftIcon size={16} />
                </button>
            )}

            {/* ── Mobile: slide-over drawer ── */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 md:hidden bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Drawer */}
                    <aside
                        className="fixed left-0 top-0 z-50 h-full w-60 md:hidden"
                        style={{ background: "var(--bg)", borderRight: "1px solid var(--border)" }}
                    >
                        {sidebarContent}
                    </aside>
                </>
            )}

            {/* ── Desktop: static sidebar ── */}
            <aside
                className="hidden md:flex flex-col h-screen w-56 shrink-0 sticky top-0"
                style={{ background: "var(--bg)", borderRight: "1px solid var(--border)" }}
            >
                {sidebarContent}
            </aside>
        </>
    )
}