"use client";

import {
  useGetInvoiceByOrderIdQuery,
  useDownloadInvoicePDFMutation,
} from "@/app/RTK Query/orderApi";

type InvoiceProps = {
  orderId: string | undefined;
};

function normalizeTaxes(taxes: any) {
  return {
    gstPercent: taxes?.gstPercent ?? 0,
    gstAmount: taxes?.gstAmount ?? 0,
    delivery: taxes?.delivery ?? 0,
    handlingCharge: taxes?.handlingCharge ?? 0,
  };
}

export default function InvoiceCard({ orderId }: InvoiceProps) {
  const { data, isLoading, isError } =
    useGetInvoiceByOrderIdQuery({ orderId });

  const [downloadInvoice, { isLoading: isInvoiceLoading }] =
    useDownloadInvoicePDFMutation();

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading invoice...
      </div>
    );
  }

  if (isError || !data?.invoice) {
    return (
      <div className="p-4 text-center text-red-600">
        Invoice not available
      </div>
    );
  }

  const { invoice } = data;
  const taxes = normalizeTaxes(invoice.taxes);

  return (
    <div className="w-full text-gray-800 max-w-3xl mx-auto bg-zinc-50 rounded-xl shadow-md p-4 sm:p-6 space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold">Invoice</h2>
          <p className="text-sm text-gray-600">
            Invoice No: {invoice.invoiceNumber}
          </p>
          <p className="text-sm text-gray-600">
            Date: {new Date(invoice.date).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => downloadInvoice({ invoiceId: invoice.id })}
          disabled={isInvoiceLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isInvoiceLoading ? "Downloading..." : "Download Invoice"}
        </button>
      </div>

      {/* Seller & Customer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-1">Seller</h3>
          <p>{invoice.buyer.name}</p>
          {invoice.buyer.company && <p>{invoice.buyer.company}</p>}
          {invoice.buyer.udyamNo && (
            <p className="text-sm text-gray-600">
              Udyam No: {invoice.buyer.udyamNo}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-1">Bill To</h3>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.phone}</p>
          {invoice.customer.location?.address && (
            <p className="text-sm text-gray-600">
              {invoice.customer.location.address}
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Items</h3>

        <div className="space-y-2">
          {invoice.items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between text-sm bg-white p-2 rounded"
            >
              <div>
                <p className="font-medium">{item.scrapName}</p>
                <p className="text-gray-500">
                  {item.measureType === "weight"
                    ? `${item.weight} kg`
                    : `${item.piece} pcs`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-semibold">
            ₹{invoice.totalAmount.toFixed(2)}
          </span>
        </div>

        {taxes.gstAmount > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>GST ({taxes.gstPercent}%)</span>
            <span>₹{taxes.gstAmount.toFixed(2)}</span>
          </div>
        )}

        {taxes.delivery > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span>₹{taxes.delivery.toFixed(2)}</span>
          </div>
        )}

        {taxes.handlingCharge > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Handling Charge</span>
            <span>₹{taxes.handlingCharge.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500 text-center pt-2">
        Payment Status: {invoice.paymentStatus}
      </div>
    </div>
  );
}
