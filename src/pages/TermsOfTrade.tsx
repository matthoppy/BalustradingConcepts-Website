import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";

const TermsOfTrade = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />
      <FixedContactButtons />
      <main className="bg-background text-foreground">
        <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
          <h1 className="text-3xl font-bold mb-10">Terms & Conditions of Trade</h1>

          {/* 1. Definitions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Definitions</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>1.1.</strong> "Balustrading Concepts Ltd" shall mean Balustrading Concepts Limited, or any agents or employees thereof.</p>
              <p><strong>1.2.</strong> "Customer" shall mean the Customer, any person acting on behalf of and with the authority of the Customer, or any person purchasing products and services from Balustrading Concepts Ltd.</p>
              <p><strong>1.3.</strong> "Products" shall mean:</p>
              <div className="pl-6 space-y-2">
                <p><strong>1.3.1.</strong> all Products of the general description specified on the front of this agreement and supplied by Balustrading Concepts Ltd to the Customer; and</p>
                <p><strong>1.3.2.</strong> all Products supplied by Balustrading Concepts Ltd to the Customer; and</p>
                <p><strong>1.3.3.</strong> all inventory of the Customer that is supplied by Balustrading Concepts Ltd; and</p>
                <p><strong>1.3.4.</strong> all Products supplied by Balustrading Concepts Ltd and further identified in any invoice issued by Balustrading Concepts Ltd to the Customer, which invoices are deemed to be incorporated into and form part of this agreement; and</p>
                <p><strong>1.3.5.</strong> all Products that are marked as having been supplied by Balustrading Concepts Ltd or that are stored by the Customer in a manner that enables them to be identified as having been supplied by Balustrading Concepts Ltd; and</p>
                <p><strong>1.3.6.</strong> all of the Customer's present and after-acquired Products that Balustrading Concepts Ltd has performed work on or to or in which goods or materials supplied or financed by Balustrading Concepts Ltd have been attached or incorporated.</p>
                <p><strong>1.3.7.</strong> The above descriptions may overlap but each is independent of and does not limit the others.</p>
              </div>
              <p><strong>1.4.</strong> "Products and Services" shall mean all goods, products, services and advice provided by Balustrading Concepts Ltd to the Customer and shall include without limitation the manufacture, supply and installation of aluminium and glass balustrades and all charges for labour, hire charges, insurance charges, or any fee or charge associated with the supply of Products and Services by Balustrading Concepts Ltd to the Customer.</p>
              <p><strong>1.5.</strong> "Price" shall mean the cost of the Products and Services as agreed between Balustrading Concepts Ltd and the Customer and includes all disbursements eg charges Balustrading Concepts Ltd pay to others on the Customer's behalf subject to clause 4 of this contract.</p>
            </div>
          </section>

          {/* 2. Acceptance */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Acceptance</h2>
            <div className="text-muted-foreground">
              <p><strong>2.1.</strong> Any instructions received by Balustrading Concepts Ltd from the Customer for the supply of Products and Services shall constitute a binding contract and acceptance of the terms and conditions contained herein.</p>
            </div>
          </section>

          {/* 3. Collection and Use of Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Collection and Use of Information</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>3.1.</strong> The Customer authorises Balustrading Concepts Ltd to collect, retain and use any information about the Customer, for the purpose of assessing the Customer's credit worthiness, enforcing any rights under this contract, or marketing any Products and Services provided by Balustrading Concepts Ltd to any other party.</p>
              <p><strong>3.2.</strong> The Customer authorises Balustrading Concepts Ltd to disclose any information obtained to any person for the purposes set out in clause 3.1.</p>
              <p><strong>3.3.</strong> Where the Customer is a natural person the authorities under clauses 3.1 and 3.2 are authorities or consents for the purposes of the Privacy Act 1993.</p>
            </div>
          </section>

          {/* 4. Price */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Price</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>4.1.</strong> Where no price is stated in writing or agreed to orally the Products and Services shall be deemed to be sold at the current amount as such Products Services are sold by Balustrading Concepts Ltd at the time of the contract.</p>
              <p><strong>4.2.</strong> The price may be increased by the amount of any reasonable increase in the cost of supply of the Products and Services that is beyond the control of Balustrading Concepts Ltd between the date of the contract and delivery of the Products and Services.</p>
            </div>
          </section>

          {/* 5. Payment */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Payment</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>5.1.</strong> Unless otherwise agreed payment for Products and Services shall be made in full on or before the 20th day of the month following the date of the invoice ("the due date").</p>
              <p><strong>5.2.</strong> Interest may be charged on any amount owing after the due date at the rate of 2.5% per month or part month.</p>
              <p><strong>5.3.</strong> Any expenses, disbursements and legal costs incurred by Balustrading Concepts Ltd in the enforcement of any rights contained in this contract shall be paid by the Customer, including any reasonable solicitor's fees or debt collection agency fees.</p>
              <p><strong>5.4.</strong> Receipt of a cheque, bill of exchange, or other negotiable instrument shall not constitute payment until such negotiable instrument is paid in full.</p>
              <p><strong>5.5.</strong> A deposit of up to 50% may be required.</p>
            </div>
          </section>

          {/* 6. Quotation */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Quotation</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>6.1.</strong> Where a quotation is given by Balustrading Concepts Ltd for Products and Services:</p>
              <div className="pl-6 space-y-2">
                <p><strong>6.1.1.</strong> Unless otherwise agreed the quotation shall be valid for thirty (30) days from the date of issue; and</p>
                <p><strong>6.1.2.</strong> The quotation shall be exclusive of goods and services tax unless specifically stated to the contrary;</p>
                <p><strong>6.1.3.</strong> Balustrading Concepts Ltd reserve the right to alter the quotation because of circumstances beyond its control.</p>
              </div>
            </div>
          </section>

          {/* 7. Title and Security */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Title and Security (Personal Property Securities Act 1999)</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>7.1.</strong> Title in any Products and Services supplied by Balustrading Concepts Ltd passes to the Customer only when the Customer has made payment in full for all Products and Services provided by Balustrading Concepts Ltd and of all other sums due to Balustrading Concepts Ltd by the Customer on any account whatsoever. Until all sums due to Balustrading Concepts Ltd by the Customer have been paid in full, Balustrading Concepts Ltd has a security interest in all Products and Services.</p>
              <p><strong>7.2.</strong> If the Products and Services are attached, fixed, or incorporated into any property of the Customer, by way of any manufacturing or assembly process by the Customer or any third party, title in the Products and Services shall remain with Balustrading Concepts Ltd until the Customer has made payment for all Products and Services, and where those Products and Services are mixed with other property so as to be part of or a constituent of any new Products and Services, title to these new Products and Services shall deemed to be assigned to Balustrading Concepts Ltd as security for the full satisfaction by the Customer of the full amount owing between Balustrading Concepts Ltd and Customer.</p>
              <p><strong>7.3.</strong> The Customer gives irrevocable authority to Balustrading Concepts Ltd to enter any premises occupied by the Customer or on which Products and Services are situated at any reasonable time after default by the Customer or before default if Balustrading Concepts Ltd believes a default is likely and to remove and repossess any Products and Services and any other property to which Products and Services are attached or in which Products and Services are incorporated. Balustrading Concepts Ltd shall not be liable for any costs, damages, expenses or losses incurred by the Customer or any third party as a result of this action, nor liable in contract or in tort or otherwise in any way whatsoever unless by statute such liability cannot be excluded. Balustrading Concepts Ltd may either resell any repossessed Products and Services and credit the Customer's account with the net proceeds of sale (after deduction of all repossession, storage, selling and other costs) or may retain any repossessed Products and Services and credit the Customer's account with the invoice value thereof less such sum as Balustrading Concepts Ltd reasonably determines on account of wear and tear, depreciation, obsolescence, loss or profit and costs.</p>
              <p><strong>7.4.</strong> Where Products and Services are retained by Balustrading Concepts Ltd pursuant to clause 7.3 the Customer waives the right to receive notice under s.120 of the Personal Property Securities Act 1999 ("PPSA") and to object under s.121 of the PPSA.</p>
              <p><strong>7.5.</strong> The following shall constitute defaults by the Customer:</p>
              <div className="pl-6 space-y-2">
                <p><strong>7.5.1.</strong> Non payment of any sum by the due date.</p>
                <p><strong>7.5.2.</strong> The Customer intimates that it will not pay any sum by the due date.</p>
                <p><strong>7.5.3.</strong> Any Products and Services are seized by any other creditor of the Customer or any other creditor intimates that it intends to seize Products and Services.</p>
                <p><strong>7.5.4.</strong> Any Products and Services in the possession of the Customer are materially damaged while any sum due from the Customer to Balustrading Concepts Ltd remains unpaid.</p>
                <p><strong>7.5.5.</strong> The Customer is bankrupted or put into liquidation or a receiver is appointed to any of the Customer's assets or a landlord distains against any of the Customer's assets.</p>
                <p><strong>7.5.6.</strong> A Court judgment is entered against the Customer and remains unsatisfied for seven (7) days.</p>
              </div>
              <p><strong>7.6.</strong> If the Credit Repossession Act applies to any transaction between the Customer and Balustrading Concepts Ltd, the Customer has the rights provided in that Act despite anything contained in these terms and conditions of trade.</p>
            </div>
          </section>

          {/* 8. Disputes */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Disputes</h2>
            <div className="text-muted-foreground">
              <p><strong>8.1.</strong> No claim relating to Products and Services will be considered unless made within seven (7) days of delivery.</p>
            </div>
          </section>

          {/* 9. Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Liability</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>9.1.</strong> The Consumer Guarantees Act 1993, the Fair Trading Act 1986 and other statutes may imply warranties or conditions or impose obligations upon Balustrading Concepts Ltd which cannot by law (or which can only to a limited extent by law) be excluded or modified. In respect of any such implied warranties, conditions or terms imposed on Balustrading Concepts Ltd, Balustrading Concepts Ltd's liability shall, where it is allowed, be excluded or if not able to be excluded only apply to the minimum extent required by the relevant statute.</p>
              <p><strong>9.2.</strong> Except as otherwise provided by clause 9.1 Balustrading Concepts Ltd shall not be liable for:</p>
              <div className="pl-6 space-y-2">
                <p><strong>9.2.1.</strong> Any loss or damage of any kind whatsoever, arising from the supply of Products and Services by Balustrading Concepts Ltd to the Customer, including consequential loss whether suffered or incurred by the Customer or another person and whether in contract or tort (including negligence) or otherwise and irrespective of whether such loss or damage arises directly or indirectly from Products and Services provided by Balustrading Concepts Ltd to the Customer; and</p>
                <p><strong>9.2.2.</strong> The Customer shall indemnify Balustrading Concepts Ltd against all claims and loss of any kind whatsoever however caused or arising and without limiting the generality of the foregoing of this clause whether caused or arising as a result of the negligence of Balustrading Concepts Ltd or otherwise, brought by any person in connection with any matter, act, omission, or error by Balustrading Concepts Ltd its agents or employees in connection with the Products and Services.</p>
              </div>
              <p><strong>9.3.</strong> If, contrary to the disclaimer of liability contained in these terms and conditions of trade, Balustrading Concepts Ltd is deemed to be liable to the Customer, following and arising from the supply of Products and Services by it to the Customer, then it is agreed between Balustrading Concepts Ltd and the Customer that such liability is limited in its aggregate to $500.00.</p>
            </div>
          </section>

          {/* 10. Warranty */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Warranty</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>10.1.</strong> Manufacturer's warranty applies where applicable.</p>
              <p><strong>10.2.</strong> Any written warranty that Balustrading Concepts Ltd provide to the Customer will also form part of these terms and conditions of trade.</p>
            </div>
          </section>

          {/* 11. Consumer Guarantees Act */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Consumer Guarantees Act</h2>
            <div className="text-muted-foreground">
              <p><strong>11.1.</strong> The guarantees contained in the Consumer Guarantees Act 1993 are excluded where the Customer acquires Products and Services from Balustrading Concepts Ltd for the purposes of a business in terms of section 2 and 43 of that Act.</p>
            </div>
          </section>

          {/* 12. Personal Guarantee */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Personal Guarantee of Company Directors or Trustees</h2>
            <div className="text-muted-foreground">
              <p><strong>12.1.</strong> If the Customer is a company or trust, the director(s) or trustee(s) signing this contract, in consideration for Balustrading Concepts Ltd agreeing to supply Products and Services and grant credit to the Customer at their request, also sign this contract in their personal capacity and jointly and severally personally undertake as principal debtors to Balustrading Concepts Ltd the payment of any and all monies now or hereafter owed by the Customer to Balustrading Concepts Ltd and indemnify Balustrading Concepts Ltd against non-payment by the Customer. Any personal liability of a signatory hereto shall not exclude the Customer in any way whatsoever from the liabilities and obligations contained in this contract. The signatories and Customer shall be jointly and severally liable under the terms and conditions of this contract and for payment of all sums due hereunder.</p>
            </div>
          </section>

          {/* 13. Miscellaneous */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Miscellaneous</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>13.1.</strong> Balustrading Concepts Ltd shall not be liable for delay or failure to perform its obligations if the cause of the delay or failure is beyond its control.</p>
              <p><strong>13.2.</strong> Failure by Balustrading Concepts Ltd to enforce any of the terms and conditions contained in this contract shall not be deemed to be a waiver of any of the rights or obligations Balustrading Concepts Ltd has under this contract.</p>
              <p><strong>13.3.</strong> If any provision of this contract shall be invalid, void or illegal or unenforceable the validity existence, legality and enforceability of the remaining provisions shall not be affected, prejudiced or impaired.</p>
              <p><strong>13.4.</strong> The Construction Contracts Act 2002 applies where applicable.</p>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfTrade;
