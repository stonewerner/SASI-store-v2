import React from 'react';

export default function TermsOfSalePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Sale</h1>
      <div className="max-w-2xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What's your return policy?</h2>
          <p>We don't offer returns and exchanges, but if there's something wrong with your order, please let us know by contacting us at stoneandspencerinc@gmail.com!</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Do you offer refunds?</h2>
          <p>Refunds are only offered to customers that receive the wrong items or damaged items. If any of these apply, please contact us at stoneandspencerinc@gmail.com with photos of wrong/damaged items and we'll sort that out for you.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Can I exchange an item for a different size/color?</h2>
          <p>At this time, we don't offer exchanges. If you're unsure which size would fit better, check out our sizing charts—we have one for every item listed on our store, in the product description section. Though rare, it's possible that an item you ordered was mislabelled. If that's the case, please let us know at stoneandspencerinc@gmail.com within a week after receiving your order. Include your order number and photos of the mislabeled item, and we'll send you a new one, or issue a refund!</p>
        </section>
      </div>
    </div>
  );
}