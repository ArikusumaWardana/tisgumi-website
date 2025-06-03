import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
    borderBottom: "1pt solid #333",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1pt solid #eee",
  },
  tableCol1: { width: "10%", textAlign: "center" },
  tableCol2: { width: "40%" },
  tableCol3: { width: "15%", textAlign: "center" },
  tableCol4: { width: "20%", textAlign: "right" },
  tableCol5: { width: "15%", textAlign: "right" },
  total: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    border: "1pt solid #ddd",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
});

// Interface for order data
interface OrderData {
  id: number;
  code: string;
  customer: {
    code: string;
    name: string;
    phone: string;
  };
  created_by_user: {
    name: string;
    code: string;
  };
  order_items: Array<{
    id: number;
    code: string;
    quantity: number;
    price_at_time: number;
    product: {
      name: string;
      code: string;
      category: {
        name: string;
      };
    };
  }>;
  total_amount: number;
  total_items: number;
  created_at: string;
  status: string;
}

interface InvoiceTemplateProps {
  orderData: OrderData;
  showPrices: boolean;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  orderData,
  showPrices,
}) => {
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {showPrices ? "INVOICE WITH PRICES" : "INVOICE WITHOUT PRICES"}
          </Text>
          <Text style={styles.subtitle}>Tisgumi Company</Text>
        </View>

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Order Information
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order Code:</Text>
            <Text style={styles.value}>{orderData.code}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(orderData.created_at)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>
              {orderData.status === "lunas" ? "Paid" : "Unpaid"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Created By:</Text>
            <Text style={styles.value}>
              {orderData.created_by_user.name} ({orderData.created_by_user.code}
              )
            </Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Customer Information
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Code:</Text>
            <Text style={styles.value}>{orderData.customer.code}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>{orderData.customer.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{orderData.customer.phone}</Text>
          </View>
        </View>

        {/* Order Items Table */}
        <View style={styles.table}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Order Items
          </Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>No.</Text>
            <Text style={styles.tableCol2}>Product Name</Text>
            <Text style={styles.tableCol3}>Qty</Text>
            {showPrices && (
              <>
                <Text style={styles.tableCol4}>Price</Text>
                <Text style={styles.tableCol5}>Subtotal</Text>
              </>
            )}
          </View>

          {/* Table Rows */}
          {orderData.order_items.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{index + 1}</Text>
              <Text style={styles.tableCol2}>
                {item.product.name}
                {"\n"}
                <Text style={{ fontSize: 10, color: "#666" }}>
                  {item.product.code} • {item.product.category.name}
                </Text>
              </Text>
              <Text style={styles.tableCol3}>{item.quantity}</Text>
              {showPrices && (
                <>
                  <Text style={styles.tableCol4}>
                    {formatCurrency(item.price_at_time)}
                  </Text>
                  <Text style={styles.tableCol5}>
                    {formatCurrency(item.price_at_time * item.quantity)}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* Total Section (only for invoices with prices) */}
        {showPrices && (
          <View style={styles.total}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Items:</Text>
              <Text style={styles.totalValue}>
                {orderData.total_items} items
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(orderData.total_amount)}
              </Text>
            </View>
          </View>
        )}

        {/* Summary for invoices without prices */}
        {!showPrices && (
          <View style={styles.total}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Items:</Text>
              <Text style={styles.totalValue}>
                {orderData.total_items} items
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This invoice was generated automatically on{" "}
            {new Date().toLocaleDateString("id-ID")}
          </Text>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};
