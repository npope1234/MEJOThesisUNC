const stories = [
  {
    name: 'Larry Edwards',
    section: 'Tribal Land Stewardship',
    affiliation: 'Lumbee Tribe of North Carolina',
    role: 'Interim Department of Agriculture and Natural Resources Manager',
    title: '',
    dek: '',
    image: './assets/larry edwards.png',
    storyBody: [
      'Larry Edwards’ interview gives the platform a present-day Indigenous land management perspective. His role with agriculture and natural resources helps ground the project in the decisions communities make now, not only in historical maps or academic descriptions of land.',
      'For the Rooted Stories platform, this story should frame invasive plants as part of a wider set of pressures on Southeastern landscapes: changing forests and waterways, community access to land, agricultural priorities, and the responsibility to care for places that carry cultural and family histories.',
      'Because the project overlays invasive species data with Indigenous lands, Edwards’ story also helps remind users that Indigenous communities are not simply represented by boundaries on a map. They are contemporary governments, departments, families, and land stewards making decisions about environmental change.'
    ],
    keyTakeaway: 'Use this story to introduce Lumbee stewardship as active, present-day environmental leadership in North Carolina.',
    platformConnection: 'Place this story near the Indigenous lands layer, the North Carolina map view, or a section explaining why the platform treats land as lived place rather than only geographic space.'
  },
  {
    name: 'Dr. Alan Weakley',
    section: 'The Plants',
    affiliation: 'UNC Herbarium, North Carolina Botanical Garden, UNC-Chapel Hill',
    role: 'Director of UNC Herbarium; Adjunct Professor',
    title: '',
    dek: '',
    image: './assets/alan weakley.AVIF',
    storyBody: [
      'Dr. Alan Weakley’s interview helps explain the ecological stakes behind the map. He describes invasive plants as species that can outcompete native plants, alter forest structure, change hydrology, and reshape the conditions that other species depend on.',
      'His perspective also complicates simple “native versus foreign” storytelling. Weakley points out that terms such as “alien,” “exotic,” “naturalized,” and “invasive” can carry cultural baggage. For this project, that matters because environmental journalism should explain ecological harm without borrowing language that echoes xenophobia or human exclusion.',
      'Weakley’s story connects plant records, conservation, ornamental horticulture, colonial plant movement, climate change, and policy gaps. It helps users understand that invasive species are not “evil”; the problem is what happens when plants are moved into new ecological relationships where they can damage native communities and a sense of place.'
    ],
    keyTakeaway: 'The platform should explain invasive species impacts while using careful, non-sensational language that emphasizes natural heritage and ecological relationships.',
    platformConnection: 'Use this story to support the species descriptions, ecological impact explanations, and any methodology note about how the project defines “invasive.”'
  },
  {
    name: 'Dr. Charles “Chuck” Bargeron',
    section: 'Data Mapping',
    affiliation: 'University of Georgia Center for Invasive Species & Ecosystem Health',
    role: 'Director',
    title: '',
    dek: '',
    image: './assets/chuck bargeron.JPG',
    storyBody: [
      'Dr. Chuck Bargeron’s interview gives the platform its strongest data-literacy frame. He explains that invasive species management is not simply about removing every harmful plant everywhere. Because eradication is often unrealistic, prevention, early detection, prioritization, and public reporting become central.',
      'His discussion of EDDMapS is especially important for an interactive map. Occurrence data can show where a species has been documented, but it is presence-biased. A blank spot on the map does not automatically mean a plant is absent; it may mean no one reported it, the land is private, or sampling was uneven.',
      'Bargeron also emphasizes responsible communication. Media coverage can help the public understand invasive species, but sensational framing or one-source reporting can distort the issue. His story encourages users to read the map as evidence, not as the whole landscape.'
    ],
    keyTakeaway: 'The map should clearly tell users that occurrence data shows documented presence, not complete absence or total coverage.',
    platformConnection: 'Use this story in map caveats, dashboard notes, and any explanation of data bias, verification, reporting gaps, and management priorities.'
  },
  {
    name: 'Ming Shen',
    section: 'Data Mapping',
    affiliation: 'Department of Geography, University of Tennessee',
    role: 'Ph.D. Student',
    title: '',
    dek: '',
    image: './assets/ming shen.JPG',
    storyBody: [
      'Ming Shen’s interview expands the project beyond ground observations by showing how remote sensing can help map invasive plants across large areas. Her work focuses on kudzu, using spectral reflectance and seasonal plant behavior to distinguish it from surrounding vegetation.',
      'This approach is valuable because kudzu can spread across roadsides, forest edges, private property, and infrastructure in ways that are difficult to track only through field observations. Time-series maps can help reveal spread patterns and connect them to climate variables and human activity.',
      'Shen’s story also adds an important caution: maps made from models are shaped by training data, ground-truth samples, and interpretation choices. This makes uncertainty part of the story, not a weakness to hide. For users, the lesson is that spatial data can reveal patterns while still needing context.'
    ],
    keyTakeaway: 'Remote sensing can make invasive plant spread more visible, but modeled maps should be read with attention to uncertainty and data limitations.',
    platformConnection: 'Use this story to explain the timeline feature, kudzu-focused analysis, dashboard trends, and the difference between observed and modeled data.'
  },
  {
    image: './assets/danielle hiraldo.AVIF',
    name: 'Dr. Danielle Hiraldo',
    section: 'Data Mapping',
    affiliation: 'American Indian Center, UNC-Chapel Hill',
    role: 'Director; citizen of the Lumbee Tribe of North Carolina',
    title: '',
    dek: '',
    storyBody: [
      'Dr. Danielle Hiraldo’s interview reframes the entire platform around sovereignty and consent. She explains that tribal governments are inherently sovereign and that land, environmental data, and cultural knowledge are shaped by governance systems, political recognition, and colonial history.',
      'Her perspective is essential for a project that maps Indigenous territories. A territory layer can help users understand historical and spatial relationships, but it can also flatten living communities into boundaries. Hiraldo’s story asks the platform to treat maps as partial representations that require consultation, care, and humility.',
      'One of the most important lessons from her interview is that public data is not automatically ethical to use. Some information may have been collected without tribal consent or may identify places, practices, or knowledge that communities do not want made public. This story pushes the project to ask not only “Can this be mapped?” but “Should this be mapped, and who gets to decide?”'
    ],
    keyTakeaway: 'Ethical environmental mapping must respect Indigenous data sovereignty, consent, and the right of communities to decide how their knowledge and lands are represented.',
    platformConnection: 'Use this story in the Indigenous lands disclaimer, methodology section, and any page explaining why the platform combines data with historical and community context.'
  },
  {
    name: 'Philip Bell',
    section: 'Tribal Land Stewardship',
    affiliation: 'Coharie Tribe',
    role: 'Great Coharie River Initiative Coordinator',
    title: '',
    dek: '',
    image: './assets/philip bell.png',
    storyBody: [
      'Philip Bell’s interview adds a direct community perspective on how invasive species can reshape a place over time. As the Great Coharie River Initiative Coordinator and a member of the Coharie community, Bell speaks from the position of someone who has watched invasive aquatic weeds affect a river tied to community identity, memory, and daily life.',
      'His story helps expand the project beyond mapped plant occurrence points. The spread of invasive plants is not only a biological issue; it can change how people access waterways, understand environmental loss, and respond to long-term damage in places that carry cultural and community meaning.',
      'For the Stories & Voices page, Bell’s interview should show how invasive species become visible through lived experience: watching a river change, seeing management challenges grow, and understanding that environmental impacts are not evenly felt across communities.'
    ],
    keyTakeaway: 'Philip Bell’s story grounds invasive species in lived experience, showing how ecological change affects waterways, community identity, and tribal stewardship.',
    platformConnection: 'Use this story to connect the map and dashboard to community observation, river restoration, and the importance of Indigenous-led environmental response.'
  }
  ];
const storyList = document.getElementById('storyList');
const storyDetail = document.getElementById('storyDetail');

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderCards() {
  const sections = [
  { title: 'The Plants' },
  { title: 'Tribal Land Stewardship' },
  { title: 'Data Mapping' }
];

  storyList.innerHTML = sections.map((section) => {
    const sectionStories = stories
      .map((story, index) => ({ story, index }))
      .filter((item) => item.story.section === section.title);

    return `
  <section class="story-section-group">
    <div class="story-section-heading">
      <div class="eyebrow">${escapeHTML(section.title)}</div>
    </div>

    <div class="story-section-cards">
      ${sectionStories.map(({ story, index }) => `
        <article class="story-card" tabindex="0" role="button" data-index="${index}">
          ${story.image ? `
          <div class="story-thumb story-thumb-image">
            <img src="${escapeHTML(story.image)}" alt="Portrait of ${escapeHTML(story.name)}">
          </div>` : ''}
          <h3>${escapeHTML(story.name)}</h3>
          <p class="subtle"><strong>${escapeHTML(story.role)}</strong><br>${escapeHTML(story.affiliation)}</p>
          <p>${escapeHTML(story.dek)}</p>
        </article>
      `).join('')}
    </div>
  </section>
`;
  }).join('');

  storyList.querySelectorAll('.story-card').forEach((card) => {
    card.addEventListener('click', () => selectStory(Number(card.dataset.index)));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectStory(Number(card.dataset.index));
      }
    });
  });

  selectStory(1);
}

function selectStory(index) {
  const story = stories[index];
  storyList.querySelectorAll('.story-card').forEach((card) => {
  card.classList.toggle('active', Number(card.dataset.index) === index);
});
  const storyParagraphs = story.storyBody.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('');
  storyDetail.innerHTML = `
    ${story.image ? `
    <div class="story-detail-visual story-detail-visual-image">
      <img src="${escapeHTML(story.image)}" alt="Portrait of ${escapeHTML(story.name)}">
    </div>` : ''}
    <div class="eyebrow">Selected interview story</div>
    <h2>${escapeHTML(story.name)}</h2>
    <p class="subtle"><strong>${escapeHTML(story.role)}</strong><br>${escapeHTML(story.affiliation)}</p>
    <p class="quote">${escapeHTML(story.dek)}</p>
    <div class="info-block"><h3>Story</h3>${storyParagraphs}</div>
    <div class="info-block"><h3>Key takeaway</h3><p>${escapeHTML(story.keyTakeaway)}</p></div>
  `;
}

renderCards();
