
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtractedData } from '@/services/browserService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExtractedDataViewProps {
  data: ExtractedData[];
}

const ExtractedDataView: React.FC<ExtractedDataViewProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        No data has been extracted yet. Try running a command like "Search for AI on Google" or "Extract data from the current page".
      </div>
    );
  }

  return (
    <ScrollArea className="h-full max-h-[500px]">
      <div className="space-y-4 p-2">
        {data.map((item, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between">
                <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Data</span>
                <span className="text-xs text-gray-400">{item.source}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(item)}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

const renderContent = (data: ExtractedData) => {
  switch (data.type) {
    case 'table':
      return (
        <Table>
          <TableHeader>
            {Array.isArray(data.content) && data.content[0] && (
              <TableRow>
                {data.content[0].map((header: string, i: number) => (
                  <TableHead key={i} className="text-gray-300">{header}</TableHead>
                ))}
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {Array.isArray(data.content) && data.content.slice(1).map((row: any[], rowIndex: number) => (
              <TableRow key={rowIndex}>
                {row.map((cell: any, cellIndex: number) => (
                  <TableCell key={cellIndex} className="text-gray-400">{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    
    case 'json':
      return (
        <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto text-xs text-gray-300">
          {JSON.stringify(data.content, null, 2)}
        </pre>
      );
    
    case 'text':
      return (
        <div className="text-gray-300">{data.content}</div>
      );
    
    case 'link':
      return (
        <ul className="list-disc pl-5 space-y-1">
          {Array.isArray(data.content) ? 
            data.content.map((link: {url: string, text: string}, i: number) => (
              <li key={i}>
                <a href={link.url} className="text-blue-400 hover:underline">{link.text}</a>
              </li>
            )) : 
            <li>
              <a href={data.content.url} className="text-blue-400 hover:underline">{data.content.text}</a>
            </li>
          }
        </ul>
      );
    
    case 'image':
      return (
        <div className="space-y-2">
          {Array.isArray(data.content) ? 
            data.content.map((img: {src: string, alt: string}, i: number) => (
              <img key={i} src={img.src} alt={img.alt} className="max-w-full rounded-md" />
            )) : 
            <img src={data.content.src} alt={data.content.alt} className="max-w-full rounded-md" />
          }
        </div>
      );
    
    default:
      return <div className="text-gray-300">Unable to display this data type</div>;
  }
};

export default ExtractedDataView;
