import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FindInSortedArray from "@/pages/BinarySearch/FindInSortedArray"
import LongestUniqueSubstring from "@/pages/LongestUniqueSubstring"
import { ScrollArea } from "../ui/scroll-area"

type FileTreeItem = { name: string; component: React.ReactNode } | { name: string; items: FileTreeItem[] }

export function AppSidebar({ setSelectedComponent }) {
    const fileTree: FileTreeItem[] = [
        {
            name: "Binary Search",
            items: [
                {
                    name: "BinarySearch.tsx",
                    component: <FindInSortedArray />
                }
            ]
        },
        {
            name: "Sliding Window",
            items: [
                {
                    name: "Longest Unique Substring.tsx",
                    component: <LongestUniqueSubstring />
                }
            ]
        }
    ]

    const renderItem = (fileItem: FileTreeItem) => {
        if ("items" in fileItem) {
            return (
                <Collapsible key={fileItem.name}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                        >
                            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                            <FolderIcon />
                            {fileItem.name}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
                        <div className="flex flex-col gap-1">
                            {fileItem.items.map((child) => renderItem(child))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        }
        return (
            <Button
                key={fileItem.name}
                variant="link"
                size="sm"
                className="w-full justify-start gap-2 text-foreground cursor-pointer"
                onClick={() => setSelectedComponent(fileItem.component)}
            >
                <FileIcon />
                <span>{fileItem.name}</span>
            </Button>
        )
    }

    return (
        <Card className="mx-auto w-full max-w-[16rem] gap-2" size="sm">
            <CardHeader>
                <Tabs defaultValue="explorer">
                    <TabsList className="w-full">
                        <TabsTrigger value="explorer">Explorer</TabsTrigger>
                        <TabsTrigger value="settings">Outline</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-screen">
                    <div className="flex flex-col gap-1">
                        {fileTree.map((item) => renderItem(item))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
