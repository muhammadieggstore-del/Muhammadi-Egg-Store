import React from 'react';
import { OrderStatus, BulkInquiryStatus } from '../../types';
import { CheckCircle2, Clock, Truck, Package, XCircle, AlertCircle, PhoneCall, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus | BulkInquiryStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const iconClass = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (status) {
    case 'Order Received':
    case 'New':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <Clock className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Confirmed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <CheckCircle2 className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Preparing':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <Package className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Out for Delivery':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <Truck className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Delivered':
    case 'Completed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <CheckCircle2 className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <XCircle className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Contacted':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <PhoneCall className={iconClass} />
          <span>{status}</span>
        </span>
      );

    case 'Quoted':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-teal-50 text-teal-700 border border-teal-200/60 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <FileText className={iconClass} />
          <span>{status}</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <AlertCircle className={iconClass} />
          <span>{status}</span>
        </span>
      );
  }
};
