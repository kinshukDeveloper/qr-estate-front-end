import DocumentsClient from './DocumentsClient';

export default function Page({
  searchParams,
}: {
  searchParams: { listing?: string };
}) {
  return <DocumentsClient listingId={searchParams.listing} />;
}