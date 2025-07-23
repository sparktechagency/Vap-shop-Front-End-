import { useGetOrderQuery } from "@/redux/features/users/userApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Receipt } from "lucide-react";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price_at_order: string;
  line_total: number;
}

interface InvoiceDetailProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDetail({
  id,
  isOpen,
  onClose,
}: InvoiceDetailProps) {
  const { data, isLoading } = useGetOrderQuery({ id });

  const orderItems: OrderItem[] = data?.data?.order_items || [];

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90dvw] lg:min-w-[60dvw] max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5" />
            Invoice Details - Order #{id}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{totalItems}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-2xl font-bold">{orderItems.length}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-center w-20">Qty</TableHead>
                  <TableHead className="text-right w-24">Price</TableHead>
                  <TableHead className="text-right w-24">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={item.product_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.product_name}</span>
                        <span className="text-sm text-muted-foreground">
                          ID: {item.product_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${Number.parseFloat(item.price_at_order).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${item.line_total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        <div className="p-6 pt-0">
          <Separator className="mb-4" />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {orderItems.length} product{orderItems.length !== 1 ? "s" : ""} •{" "}
              {totalItems} item
              {totalItems !== 1 ? "s" : ""}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Subtotal</div>
              <div className="text-2xl font-bold text-green-600">
                ${subtotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
