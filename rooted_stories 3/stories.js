const stories = [
  {
    name: 'Larry Edwards',
    affiliation: 'Lumbee Tribe of North Carolina',
    role: 'Interim Department of Agriculture and Natural Resources Manager',
    title: 'Stewardship, natural resources, and Lumbee relationships to land',
    dek: 'A community-centered story about how environmental change is understood through land management, agriculture, water, and responsibility to place.',
    image: '',
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
    affiliation: 'UNC Herbarium, North Carolina Botanical Garden, UNC-Chapel Hill',
    role: 'Director of UNC Herbarium; Adjunct Professor',
    title: 'Natural heritage, invasive plants, and the language of belonging',
    dek: 'A botanical story about how non-native plants alter Southeastern ecosystems — and why the words used to describe them matter.',
    image: './assets/alan-weakley.avif',
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
    affiliation: 'University of Georgia Center for Invasive Species & Ecosystem Health',
    role: 'Director',
    title: 'What invasive species maps can show — and what they can miss',
    dek: 'A data infrastructure story about EDDMapS, public reporting, management limits, and the danger of reading occurrence points as complete truth.',
    image: './assets/chuck-bargeron.jpeg',
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
    affiliation: 'Department of Geography, University of Tennessee',
    role: 'Ph.D. Student',
    title: 'Seeing kudzu from above: remote sensing and uncertainty',
    dek: 'A geospatial science story about mapping kudzu through spectral patterns, seasonal change, and time-series analysis.',
    image: '',
    storyBody: [
      'Ming Shen’s interview expands the project beyond ground observations by showing how remote sensing can help map invasive plants across large areas. Her work focuses on kudzu, using spectral reflectance and seasonal plant behavior to distinguish it from surrounding vegetation.',
      'This approach is valuable because kudzu can spread across roadsides, forest edges, private property, and infrastructure in ways that are difficult to track only through field observations. Time-series maps can help reveal spread patterns and connect them to climate variables and human activity.',
      'Shen’s story also adds an important caution: maps made from models are shaped by training data, ground-truth samples, and interpretation choices. This makes uncertainty part of the story, not a weakness to hide. For users, the lesson is that spatial data can reveal patterns while still needing context.'
    ],
    keyTakeaway: 'Remote sensing can make invasive plant spread more visible, but modeled maps should be read with attention to uncertainty and data limitations.',
    platformConnection: 'Use this story to explain the timeline feature, kudzu-focused analysis, dashboard trends, and the difference between observed and modeled data.'
  },
  {
    image: './assets/danielle-hiraldo.avif',
    name: 'Dr. Danielle Hiraldo',
    affiliation: 'American Indian Center, UNC-Chapel Hill',
    role: 'Director; citizen of the Lumbee Tribe of North Carolina',
    title: 'Sovereignty, consent, and the ethics of mapping Indigenous lands',
    dek: 'A governance and environmental justice story about why public data is not automatically appropriate to map or publish.',
    storyBody: [
      'Dr. Danielle Hiraldo’s interview reframes the entire platform around sovereignty and consent. She explains that tribal governments are inherently sovereign and that land, environmental data, and cultural knowledge are shaped by governance systems, political recognition, and colonial history.',
      'Her perspective is essential for a project that maps Indigenous territories. A territory layer can help users understand historical and spatial relationships, but it can also flatten living communities into boundaries. Hiraldo’s story asks the platform to treat maps as partial representations that require consultation, care, and humility.',
      'One of the most important lessons from her interview is that public data is not automatically ethical to use. Some information may have been collected without tribal consent or may identify places, practices, or knowledge that communities do not want made public. This story pushes the project to ask not only “Can this be mapped?” but “Should this be mapped, and who gets to decide?”'
    ],
    keyTakeaway: 'Ethical environmental mapping must respect Indigenous data sovereignty, consent, and the right of communities to decide how their knowledge and lands are represented.',
    platformConnection: 'Use this story in the Indigenous lands disclaimer, methodology section, and any page explaining why the platform combines data with historical and community context.'
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
  storyList.innerHTML = stories.map((story, index) => `
    <article class="story-card ${index === 0 ? 'active' : ''}" tabindex="0" role="button" data-index="${index}">
      ${story.image ? `
      <div class="story-thumb story-thumb-image">
        <img src="${escapeHTML(story.image)}" alt="Portrait of ${escapeHTML(story.name)}">
      </div>` : ''}
      <div class="eyebrow">Interview story</div>
      <h3>${escapeHTML(story.name)}</h3>
      <p class="subtle"><strong>${escapeHTML(story.role)}</strong><br>${escapeHTML(story.affiliation)}</p>
      <p>${escapeHTML(story.title)}</p>
    </article>
  `).join('');

  storyList.querySelectorAll('.story-card').forEach((card) => {
    card.addEventListener('click', () => selectStory(Number(card.dataset.index)));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectStory(Number(card.dataset.index));
      }
    });
  });
  selectStory(0);
}

function selectStory(index) {
  const story = stories[index];
  storyList.querySelectorAll('.story-card').forEach((card, i) => card.classList.toggle('active', i === index));
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
    <div class="info-block"><h3>How this shapes the platform</h3><p>${escapeHTML(story.platformConnection)}</p></div>
  `;
}

renderCards();
