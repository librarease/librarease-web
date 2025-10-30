import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RefreshCw, Upload } from 'lucide-react'

export default function ImportBooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>
          Select a CSV file to preview the import
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept=".csv,text/csv"
              // onChange={console.log}
              className="block w-full text-sm text-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20
                      cursor-pointer"
            />
          </div>
          <Button disabled={false}>
            {true ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Generate Preview
              </>
            )}
          </Button>
        </div>
        {/* {file && (
                <div className="text-sm text-muted-foreground">
                  Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )} */}
      </CardContent>
    </Card>
  )
}
