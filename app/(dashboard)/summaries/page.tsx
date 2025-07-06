"use client";
import { motion } from "framer-motion";
import { FileText, Eye, Languages, Download, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const SummariesPage = () => {
  const summaries = [
    {
      id: 1,
      title: "Q4 Financial Report.pdf",
      type: "PDF",
      date: "2024-01-15",
      wordCount: 1250,
      reduction: "78%",
      status: "completed",
    },
    {
      id: 2,
      title: "Product Roadmap Meeting Notes",
      type: "Text",
      date: "2024-01-14",
      wordCount: 890,
      reduction: "65%",
      status: "completed",
    },
    {
      id: 3,
      title: "Market Research Document.docx",
      type: "DOCX",
      date: "2024-01-13",
      wordCount: 2100,
      reduction: "82%",
      status: "completed",
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Summaries</h1>
            <p className="text-muted-foreground">
              Manage and review your document summaries
            </p>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            New Summary
          </Button>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Summaries</CardTitle>
            <CardDescription>
              Your latest processed documents and their summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Word Count</TableHead>
                  <TableHead>Reduction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((summary, index) => (
                  <motion.tr
                    key={summary.id}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <TableCell className="font-medium">
                      {summary.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{summary.type}</Badge>
                    </TableCell>
                    <TableCell>{summary.date}</TableCell>
                    <TableCell>{summary.wordCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="text-green-600" variant="outline">
                        {summary.reduction}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {summary.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Languages className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          className="text-destructive"
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SummariesPage;
