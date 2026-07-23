import type { LegalDocument } from '../types'

export const qualityPolicyEn: LegalDocument = {
  title: 'Quality Policy',
  sections: [
    {
      id: 'philosophy',
      number: '1',
      title: 'Our philosophy',
      blocks: [
        {
          type: 'paragraphs',
          texts: [
            'Our philosophy is oriented towards providing services that satisfy our clients, meeting the requirements set out in the contracts or orders established with them. To that end, we will use all means at our disposal to ensure effective working methods and appropriate processes, so that we deliver reliable security installations suited to the client’s requirements.',
            'A priority for us is always to comply with the legislation in force in the sector in which we operate — architecture, interior design and construction.',
            'We consider that clients play a significant and priority role in defining the quality of our service. For that reason, we take action to assess their level of satisfaction.',
            'Our policy includes the purpose of practising continuous improvement and error prevention, understanding that we must do everything possible to anticipate the client’s needs.',
            'We regard the following as essential: response time to clients, delivering projects tailored to their needs, individualised advice, follow-through of the entire process (from project start to completion of works), highly qualified staff, innovative ideas, good communication, and the use of new technologies — enabling clients to make effective use of their time.',
            'To put our policy into practice, we have implemented a management system based on the UNE-EN ISO 9001:2015 standard.',
          ],
        },
      ],
    },
    {
      id: 'priorities',
      number: '2',
      title: 'Our priorities',
      blocks: [
        {
          type: 'paragraphs',
          texts: ['Our priorities are as follows:'],
        },
        {
          type: 'list',
          items: [
            'To orient our organisation’s quality management around the procedures we have in place, emphasising the development of those procedures and relating them to one another in a way that is optimal for our company and way of working.',
            'To maintain a useful and effective management system.',
            'To promote and provide continuous training at all levels, delivering knowledge of new techniques and tools that are useful for service provision.',
            'To give due priority to risk treatment with preventive effect, understanding that the objective analysis of errors and non-conformities is the only way to take action to correct and prevent future deviations.',
            'To ensure that clients’ needs and expectations are specifically known, including that company staff maintain good communication with them.',
            'To analyse data and draw conclusions.',
          ],
        },
      ],
    },
    {
      id: 'commitment',
      number: '3',
      title: 'Management commitment',
      blocks: [
        {
          type: 'paragraphs',
          texts: [
            'Management undertakes to communicate, explain and maintain, with the means at its disposal, the contents of this Quality Policy.',
            'In this regard, this Policy is publicly displayed and made available to interested parties.',
            'Management ensures that this policy is understood by staff through reading, explanation, communications and training.',
            'The director of WPCG is primarily responsible for maintaining the Quality Policy through its control and periodic review, to ensure its suitability and continued validity.',
          ],
        },
      ],
    },
  ],
}
