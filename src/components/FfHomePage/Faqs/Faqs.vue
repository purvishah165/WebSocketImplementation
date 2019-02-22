<template>
    <div class="content-area col-sm-12 main-content-section">
        <div class="faq-container container">
            <div class="col-md-3 col-12"></div>
            <div role="tablist" class="col-md-6 col-12 faq-box">
                <div class="col-lg-12 text-center add-mobile-top">
                    <h1 class="heading-title">FAQ's</h1>
                </div>
                <div class="text-center mb-2">
                    <img width="300" height="105" src="@/assets/faq-300x105.png" class="attachment-medium size-medium" alt="">
                </div>
                <b-card no-body class="mb-1 no-border no-radius" v-for="(faqs, index) in faqlist" v-bind:key="index">
                    <b-card-header header-tag="header" class="faq-title " role="tab">
                        <a v-b-toggle="'accordion'+index"><div class="col-1"><i class="fa fa-chevron" ></i></div><div class="col-11"><b>{{faqs.question}}</b></div></a>
                    </b-card-header>
                    <b-collapse :id="'accordion'+index" class="no-transition" role="tabpanel">
                        <b-card-body>
                            <p class="card-text" v-html="faqs.answer">
                            </p>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>
            <div class="col-md-3 col-12"></div>
        </div>
    </div>
</template>

<script>
import { PageState } from '@/main'
export default {
  name: 'faqs',
  data () {
    return {
      faqlist: [
        {
          question: 'What does FastFinancials do?',
          answer: 'We provide a simple and easy service to the lender, brokers, advisers and financial service providers to extract financial information from their customers.'
        },
        {
          question: 'Who uses FastFinancials?',
          answer: 'FastFinancials can be used by loan brokers, financial advisers, lenders and anyone interested in extracting financial information from customers. It is an easy way to extract financial information for a third party.'
        },
        {
          question: 'How is the information being extracted from the customer?',
          answer: 'You decide what reports you need from the customer, generate a smart link and send it to your customer. Your customer clicks it, connects to his accounting package or manually uploads documents, and we send it back to you in a standard format with additional analysis and industry standard reporting. Check out our "How it Works" page for more information.'
        },
        {
          question: 'What kind of financial information can be extracted from a customer?',
          answer: 'We can retrieve Profit & Loss statements, Balance Sheets, Bank Statements & Summaries, Aged Debtors & Creditors, Cashflow Reports and more. We are the leading provider of integration services. Contact us for more information in regards to systems and reports.'
        },
        {
          question: 'How do I use the smart link?',
          answer: 'Once you have generated a smart link, simply forward to your client via email, SMS or carrier pigeon. Once the client clicks on the link, they will be forwarded to a secure document portal. They will be able to integrate with their accounting package or upload files, providing you with the information you have requested.'
        },
        {
          question: 'Can anyone click the link?',
          answer: 'Anyone can click the link. They have to go through the verification process and provide credentials for their accounting package.'
        },
        {
          question: 'How is the financial information being received after the customer has integrated with their accounting package?',
          answer: 'The information is collated, automatically analysed and sent to the requester via email. Our Loan Hero module and Loan Hero AI completes sophisticated analysis and provides the most up to date information.'
        },
        {
          question: 'Is it a good experience for the client providing the financials?',
          answer: 'As the name suggests, the experience is Fast, because we have removed all the friction. Customers or their advisors often struggle to find, scan or forward the correct information. The process will delight your customer. It is as simple as clicking a link!'
        },
        {
          question: 'How much time is available to provide the documents via the link?',
          answer: 'The link is valid for 30 days, from the day that it is generated. If the link has expired, simply contact the sender of the link to generate a new one for you or generate a new one.'
        },
        {
          question: 'What accounting packages can be connected to FastFinancial platform by the customer?',
          answer: 'Xero, Myob and Quickbooks. We are constantly adding new systems and reports. Reach out to suggest additional integrations as we expand our service.'
        },
        {
          question: 'How reliable is the information in an accounting package?',
          answer: 'Information in the accounting package is reliable and very difficult to manipulate. It is much easier to forge a pdf than to change information within the accounting package. Additionally, we have a verification step (see other FAQ’s).'
        },
        {
          question: 'How do I know if the information is ‘up to date’?',
          answer: 'As part of the customer process, the customer reviews and selects status for the financial information provided. This is vitally important and will indicate if the financial information for each period (e.g. FY17) or report type (e.g. Aged Payables) has been lodged with the tax office, prepared by an accountant or for management use.'
        },
        {
          question: 'Does the customer verify the information?',
          answer: 'As part of the review process, the information provider digitally \'signs off\' on the financial information, verifying that it is correct and reflects the financial position of the business. The customer also has the ability to provide commentary on account information.'
        },
        {
          question: 'Can a customer provide documents without connecting to an accounting package?',
          answer: 'Yes, a customer can provide information by uploading it from the device that they are using.'
        },
        {
          question: 'Can I use the same link as many times as I want?',
          answer: 'No. Each link can only be used one time. Each link is unique in the information that it is requesting and the purpose of the information, so they have been designed as ‘single-use links’.'
        },
        {
          question: 'What do Fast Financials do with the financial information?',
          answer: 'We send the financial documents to the requester, and that`s it. We do not keep or store the financials in our databases or transferring them to any third party.'
        },
        {
          question: 'Who authorises you to get the financial information from the customer?',
          answer: 'The customer is always in control of what information is provided. The customer allows us to retrieve reports and financial information from their systems.'
        },
        {
          question: 'Where are you located?',
          answer: 'Fast Financials is a product of Stream Lending.<a href="https://streamlending.com.au/" target="_blank" class="color-blue"> Stream Lending</a> is based in Sydney, Australia. Our infrastructure and team are based in Sydney Australia'
        },
        {
          question: 'What Technology is Fast Financials using?',
          answer: 'We provide a frictionless platform for third parties to access financial information. We are using technology to remove the friction in providing accurate financial information to third parties.'
        }
      ]
    }
  },
  mounted () {
    PageState.$emit('issdp', false)
    PageState.$emit('isAccount', false)
    PageState.$emit('ishome', true)
  }
}
</script>

<style scoped>
    .no-border{
        border: none;
    }
    .no-radius{
        border-radius: 0px;
    }
</style>
