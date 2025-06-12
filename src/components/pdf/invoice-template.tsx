import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#333",
  },
  // Header section
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    alignItems: "flex-start",
  },
  headerLeft: {
    width: "60%",
    flexDirection: "column",
  },
  companyBranding: {
    flexDirection: "column",
  },
  headerRight: {
    width: "35%",
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    letterSpacing: 1,
  },
  companyTagline: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 15,
  },
  companyInfo: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.4,
    marginBottom: 2,
  },
  companyInfoContainer: {
    marginTop: 5,
  },
  // Address list styles
  addressContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addressList: {
    flexDirection: "column",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  addressBullet: {
    fontSize: 8,
    color: "#666",
    marginRight: 6,
    marginTop: 1,
  },
  addressText: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.3,
    flex: 1,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 2,
    marginTop: 0,
    marginBottom: 15,
  },
  // Invoice details (without background)
  invoiceDetails: {
    marginTop: 0,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: "50%",
    fontSize: 11,
    color: "#666",
    fontWeight: "bold",
  },
  detailValue: {
    width: "50%",
    fontSize: 11,
    color: "#333",
  },
  // Customer and payment info
  infoSection: {
    marginBottom: 40,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLeft: {
    width: "45%",
  },
  infoRight: {
    width: "45%",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  // Table styles
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderTop: "1pt solid #e9ecef",
    borderBottom: "1pt solid #e9ecef",
  },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderBottom: "1pt solid #f1f3f4",
    minHeight: 40,
  },
  // Table columns
  colDescription: {
    width: "50%",
    fontSize: 11,
    paddingRight: 10,
  },
  colUnitPrice: {
    width: "20%",
    textAlign: "right",
    fontSize: 11,
  },
  colQty: {
    width: "15%",
    textAlign: "center",
    fontSize: 11,
  },
  colTotal: {
    width: "15%",
    textAlign: "right",
    fontSize: 11,
  },
  // Table header text
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Product details
  productName: {
    fontSize: 11,
    color: "#333",
    fontWeight: "normal",
    marginBottom: 2,
  },
  productCode: {
    fontSize: 9,
    color: "#888",
    fontStyle: "italic",
  },
  // Totals section
  totalsContainer: {
    marginTop: 5,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: "40%",
    minWidth: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
  },
  subtotalRow: {
    borderTop: "1pt solid #e9ecef",
    paddingTop: 12,
    marginTop: 8,
  },
  finalTotalRow: {
    borderTop: "2pt solid #333",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 11,
    color: "#333",
    fontWeight: "bold",
  },
  finalTotalLabel: {
    fontSize: 13,
    color: "#333",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  finalTotalValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "bold",
  },
  // Footer
  footer: {
    marginTop: 60,
    paddingTop: 20,
    borderTop: "1pt solid #e9ecef",
  },
  footerNote: {
    fontSize: 9,
    color: "#888",
    textAlign: "center",
    lineHeight: 1.4,
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
    return `Rp. ${amount.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPhoneNumber = (phone: string) => {
    // Add + prefix if not already present
    return phone.startsWith("+") ? phone : `+${phone}`;
  };

  const total = orderData.total_amount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <View style={styles.companyBranding}>
              <Text style={styles.companyName}>TISGUMI</Text>
              <Text style={styles.companyTagline}>
                Authentic Indonesian Restaurant
              </Text>
              <View style={styles.companyInfoContainer}>
                {/* Address Section */}
                <View style={styles.addressContainer}>
                  <Text style={styles.addressTitle}>Our Locations:</Text>
                  <View style={styles.addressList}>
                    <View style={styles.addressItem}>
                      <Text style={styles.addressBullet}>•</Text>
                      <Text style={styles.addressText}>
                        Jl. Gatot Subroto Tim., Tonja, Kec. Denpasar Utara, Kota
                        Denpasar, Bali
                      </Text>
                    </View>
                    <View style={styles.addressItem}>
                      <Text style={styles.addressBullet}>•</Text>
                      <Text style={styles.addressText}>
                        Jl. Hasanuddin No.30, Dauh Puri Kangin, Kec. Denpasar
                        Bar., Kota Denpasar, Bali
                      </Text>
                    </View>
                    <View style={styles.addressItem}>
                      <Text style={styles.addressBullet}>•</Text>
                      <Text style={styles.addressText}>
                        Jl. Kartika Plaza, Kuta, Kec. Kuta, Kabupaten Badung,
                        Bali
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Contact Information */}
                <Text style={styles.companyInfo}>
                  +6285 5807 0605 | Instagram: @tisgumi
                </Text>
                <Text style={styles.companyInfo}>www.tisgumi.vercel.app</Text>
                <Text style={styles.companyInfo}>
                  Open Daily: 10:00 AM - 22:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.invoiceDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>INVOICE NO:</Text>
                <Text style={styles.detailValue}>{orderData.code}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DATE:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(orderData.created_at)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>STATUS:</Text>
                <Text style={styles.detailValue}>
                  {orderData.status.toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SERVED BY:</Text>
                <Text style={styles.detailValue}>
                  {orderData.created_by_user.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer and Payment Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoContainer}>
            <View style={styles.infoLeft}>
              <Text style={styles.sectionTitle}>ISSUED TO:</Text>
              <Text style={styles.infoText}>{orderData.customer.name}</Text>
              <Text style={styles.infoText}>
                Customer Code: {orderData.customer.code}
              </Text>
              <Text style={styles.infoText}>
                Phone: {formatPhoneNumber(orderData.customer.phone)}
              </Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.sectionTitle}>PAY TO:</Text>
              <Text style={styles.infoText}>Tisgumi Company</Text>
              <Text style={styles.infoText}>Bank: Bank Central Asia (BCA)</Text>
              <Text style={styles.infoText}>
                Account Name: Yanti
              </Text>
              <Text style={styles.infoText}>Account No: 1271 2410 50</Text>
            </View>
          </View>
        </View>

        {/* Order Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colDescription, styles.tableHeaderText]}>
              DESCRIPTION
            </Text>
            {showPrices && (
              <Text style={[styles.colUnitPrice, styles.tableHeaderText]}>
                UNIT PRICE
              </Text>
            )}
            <Text style={[styles.colQty, styles.tableHeaderText]}>QTY</Text>
            {showPrices && (
              <Text style={[styles.colTotal, styles.tableHeaderText]}>
                TOTAL
              </Text>
            )}
          </View>

          {/* Table Rows */}
          {orderData.order_items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colDescription}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productCode}>
                  {item.product.code} • {item.product.category.name}
                </Text>
              </View>
              {showPrices && (
                <Text style={styles.colUnitPrice}>
                  {formatCurrency(item.price_at_time)}
                </Text>
              )}
              <Text style={styles.colQty}>{item.quantity}</Text>
              {showPrices && (
                <Text style={styles.colTotal}>
                  {formatCurrency(item.price_at_time * item.quantity)}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            {showPrices ? (
              <View style={[styles.totalRow, styles.finalTotalRow]}>
                <Text style={styles.finalTotalLabel}>TOTAL</Text>
                <Text style={styles.finalTotalValue}>
                  {formatCurrency(total)}
                </Text>
              </View>
            ) : (
              <View style={[styles.totalRow, styles.subtotalRow]}>
                <Text style={styles.totalLabel}>TOTAL ITEMS</Text>
                <Text style={styles.totalValue}>
                  {orderData.total_items} items
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            This invoice was generated automatically on{" "}
            {new Date().toLocaleDateString("id-ID")}.{"\n"}
            Thank you for your business with Tisgumi!
          </Text>
        </View>
      </Page>
    </Document>
  );
};
