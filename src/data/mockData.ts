import { User, Folder, Note, Transaction } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    handle: '@marcus_stanford',
    email: 'mvance@stanford.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    university: 'Stanford University',
    major: 'Computer Science & AI',
    role: 'Honors Scholar',
    isVerified: true,
    verificationBadge: 'A+ Certified',
    walletBalance: 88.50,
    totalEarnings: 320.00,
    rating: 4.95,
    ratingsCount: 42,
    notesSoldCount: 56,
    notesBoughtCount: 8,
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    handle: '@elena_mit',
    email: 'erostova@mit.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    university: 'Massachusetts Institute of Technology (MIT)',
    major: 'Biological Engineering & Biochemistry',
    role: 'Teaching Assistant',
    isVerified: true,
    verificationBadge: 'TA Approved',
    walletBalance: 142.75,
    totalEarnings: 590.25,
    rating: 4.98,
    ratingsCount: 78,
    notesSoldCount: 94,
    notesBoughtCount: 15,
  },
  {
    id: 'user_jordan',
    name: 'Jordan Lee',
    handle: '@jordan_berkeley',
    email: 'jlee@berkeley.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    university: 'UC Berkeley',
    major: 'Economics & Data Science',
    role: 'Student',
    isVerified: true,
    verificationBadge: 'Department Peer',
    walletBalance: 45.00,
    totalEarnings: 85.00,
    rating: 4.88,
    ratingsCount: 19,
    notesSoldCount: 12,
    notesBoughtCount: 19,
  },
];

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder_cs161',
    name: 'CS 161: Algorithms & Data Structures',
    courseCode: 'CS 161',
    university: 'Stanford University',
    color: '#3B82F6', // Blue
    icon: 'code',
  },
  {
    id: 'folder_biol701',
    name: 'BIOL 701: Molecular & Cell Biology',
    courseCode: 'BIOL 701',
    university: 'MIT',
    color: '#10B981', // Emerald
    icon: 'dna',
  },
  {
    id: 'folder_econ102',
    name: 'ECON 102: Macroeconomic Theory',
    courseCode: 'ECON 102',
    university: 'UC Berkeley',
    color: '#F59E0B', // Amber
    icon: 'trending-up',
  },
  {
    id: 'folder_chem302',
    name: 'CHEM 302: Organic Chemistry II',
    courseCode: 'CHEM 302',
    university: 'Harvard University',
    color: '#8B5CF6', // Purple
    icon: 'flask',
  },
  {
    id: 'folder_math215',
    name: 'MATH 215: Linear Algebra & Matrix Theory',
    courseCode: 'MATH 215',
    university: 'Columbia University',
    color: '#EC4899', // Pink
    icon: 'calculator',
  },
  {
    id: 'folder_purchased',
    name: 'Purchased Notes & Study Guides',
    color: '#6366F1', // Indigo
    icon: 'shopping-bag',
  },
  {
    id: 'folder_collaborations',
    name: 'Shared Study Groups & Peer Drafts',
    color: '#06B6D4', // Cyan
    icon: 'users',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_algo_graphs',
    title: 'Graph Traversal & Shortest Path: Dijkstra, Bellman-Ford, & A*',
    folderId: 'folder_cs161',
    authorId: 'user_marcus',
    authorName: 'Marcus Vance',
    authorHandle: '@marcus_stanford',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    authorUniversity: 'Stanford University',
    authorVerified: true,
    authorBadge: 'A+ Certified',
    courseCode: 'CS 161',
    courseName: 'Design & Analysis of Algorithms',
    term: 'Fall 2026',
    subject: 'Computer Science',
    tags: ['Algorithms', 'Graph Theory', 'Dijkstra', 'Midterm Prep', 'Big-O'],
    coverImage: '/src/assets/images/cover_notes_algorithms_1794077808605.jpg',
    content: `# CS 161: Graph Shortest Path Master Notes

## 1. Dijkstra's Algorithm (Non-Negative Edge Weights)
Dijkstra solves the Single-Source Shortest Path (SSSP) problem on directed or undirected graphs with edge weights $w(u, v) \\ge 0$.

### Core Invariant
At each step, the vertex $u \\in V \\setminus S$ with minimum tentative distance $d[u]$ is finalized. Since all edge weights are strictly non-negative, no subsequent path through unexplored vertices can yield a shorter distance to $u$.

### Complexity Breakdown
- **With Binary Min-Heap:** $O((V + E) \\log V)$
- **With Fibonacci Heap:** $O(E + V \\log V)$
- **Space Complexity:** $O(V)$ for priority queue and predecessor tracking

\`\`\`typescript
function dijkstra(graph: Graph, source: NodeId): Map<NodeId, number> {
  const dist = new Map<NodeId, number>();
  const pq = new PriorityQueue<NodeId>();

  for (const v of graph.nodes) dist.set(v, Infinity);
  dist.set(source, 0);
  pq.insert(source, 0);

  while (!pq.isEmpty()) {
    const u = pq.extractMin();
    for (const [v, weight] of graph.neighbors(u)) {
      if (dist.get(u)! + weight < dist.get(v)!) {
        dist.set(v, dist.get(u)! + weight);
        pq.decreaseKey(v, dist.get(v)!);
      }
    }
  }
  return dist;
}
\`\`\`

---

## 2. Bellman-Ford Algorithm (Handles Negative Weights & Cycle Detection)
When a graph contains negative edge weights, Dijkstra fails because greedy choices become invalid.

### Recurrence Relation
Let $d^{(k)}[v]$ be the weight of the shortest path from $s$ to $v$ with at most $k$ edges:
$$d^{(k)}[v] = \\min \\{ d^{(k-1)}[v], \\min_{(u, v) \\in E} \\{ d^{(k-1)}[u] + w(u, v) \\} \\}$$

- **Rounds:** Relax all edges $|V| - 1$ times. Total time: $O(V \\cdot E)$.
- **Negative Cycle Check:** Run 1 additional relaxation pass. If any edge can still be relaxed ($d[u] + w(u, v) < d[v]$), a negative cycle exists and SSSP is undefined.

---

## 3. A* Search with Admissible Heuristics
A* speeds up SSSP by introducing an admissible heuristic function $h(n)$ such that:
$$f(n) = g(n) + h(n)$$
Where $g(n)$ is true cost from source to $n$, and $h(n) \\le h^*(n)$ never overestimates remaining cost to goal. If $h(n)$ is also **consistent** ($h(u) \\le w(u, v) + h(v)$), then A* never reopens closed nodes.`,
    keyTakeaways: [
      "Dijkstra requires non-negative edge weights; runtime is O((V + E) log V) with binary heap.",
      "Bellman-Ford runs in O(V · E) and detects negative cycles by relaxing edges V times.",
      "A* is optimal if the heuristic h(n) is admissible and monotonic (consistent).",
      "Common exam trap: adding a constant C to all edge weights does NOT fix Dijkstra for negative graphs because paths with more edges are penalized disproportionately."
    ],
    flashcards: [
      {
        id: 'fc_1',
        question: 'Why does adding a constant C to all edge weights fail to fix Dijkstra on negative weight graphs?',
        answer: 'Because paths with more hops receive the penalty C multiple times, altering the true shortest path ordering.'
      },
      {
        id: 'fc_2',
        question: 'What is the condition for an A* heuristic to be consistent (monotonic)?',
        answer: 'h(u) <= w(u, v) + h(v) for every edge (u, v), satisfying the triangle inequality.'
      },
      {
        id: 'fc_3',
        question: 'How does Bellman-Ford detect negative weight cycles reachable from the source?',
        answer: 'By checking if any edge (u, v) can still be relaxed after |V|-1 iterations.'
      }
    ],
    revisionChecklist: [
      { task: 'Memorize priority queue relaxation operations & invariants', completed: true },
      { task: 'Practice Bellman-Ford matrix table tracing on exam sample', completed: true },
      { task: 'Derive admissibility proof for Euclidean distance heuristic', completed: false },
      { task: 'Review Johnson algorithm all-pairs shortest paths', completed: false }
    ],
    isForSale: true,
    price: 6.50,
    previewPercent: 40,
    isVerifiedContent: true,
    verificationType: 'A+ Grade Verified',
    salesCount: 38,
    rating: 4.96,
    reviewsCount: 16,
    reviews: [
      {
        id: 'rev_1',
        userId: 'user_jordan',
        userName: 'Jordan Lee',
        userUniversity: 'UC Berkeley',
        rating: 5,
        comment: 'The explanation of why adding constant C breaks Dijkstra saved me on our midterm. Immaculate pseudocode and proofs.',
        date: '3 days ago',
        verifiedBuyer: true
      },
      {
        id: 'rev_2',
        userId: 'user_anonymous',
        userName: 'Rachel K.',
        userUniversity: 'Stanford University',
        rating: 5,
        comment: 'Marcus’s notes are legendary in CS 161. Totally worth the $6.50—better than the textbook slides.',
        date: '1 week ago',
        verifiedBuyer: true
      }
    ],
    isCollaborative: true,
    collaboratorIds: ['user_jordan', 'user_elena'],
    comments: [
      {
        id: 'comm_1',
        userId: 'user_elena',
        userName: 'Elena Rostova',
        userHandle: '@elena_mit',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
        text: 'Marcus, could we add a diagram for the Fibonacci Heap amortized decrease-key step? That was on the problem set.',
        timestamp: '2 hours ago',
        highlightedText: 'With Fibonacci Heap: O(E + V log V)',
        likes: 4,
        replies: [
          {
            id: 'comm_1_1',
            userId: 'user_marcus',
            userName: 'Marcus Vance',
            userHandle: '@marcus_stanford',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            text: 'Great point Elena! I am sketching the cascading cut trees right now and will update the notes tonight.',
            timestamp: '1 hour ago',
            likes: 2
          }
        ]
      }
    ],
    createdAt: '2026-10-14T09:30:00Z',
    updatedAt: '2026-11-05T14:20:00Z'
  },
  {
    id: 'note_chemiosmosis',
    title: 'Cellular Respiration & Chemiosmosis: The ATP Synthase Complex',
    folderId: 'folder_biol701',
    authorId: 'user_elena',
    authorName: 'Elena Rostova',
    authorHandle: '@elena_mit',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    authorUniversity: 'MIT',
    authorVerified: true,
    authorBadge: 'TA Approved',
    courseCode: 'BIOL 701',
    courseName: 'Molecular & Cellular Biochemistry',
    term: 'Fall 2026',
    subject: 'Biology',
    tags: ['Biochemistry', 'Mitochondria', 'Chemiosmosis', 'ATP Synthase', 'TA Verified'],
    coverImage: '/src/assets/images/hero_academic_study_1794077808241.jpg',
    content: `# BIOL 701: Chemiosmosis & Mitochondrial Bioenergetics

## 1. The Proton-Motive Force (PMF)
Peter Mitchell’s Chemiosmotic Hypothesis states that free energy released during electron transport from NADH/FADH2 through Complexes I, III, and IV is converted into an electrochemical transmembrane proton gradient:

$$\\Delta p = \\Delta \\psi - \\frac{2.3 RT}{F} \\Delta \\text{pH}$$

Where:
- $\\Delta \\psi$: Membrane electrical potential ($\approx 160\\text{--}180\\text{ mV}$, negative inside matrix).
- $\\Delta \\text{pH}$: Chemical pH differential ($\approx 0.75\\text{--}1.0\\text{ units}$, matrix is more alkaline).
- Total PMF in active mammalian mitochondria is roughly **200 to 220 mV**.

---

## 2. ATP Synthase ($F_o F_1$ Rotary Engine)
The enzyme is composed of two functional assemblies:

### The $F_o$ Subunit (Membrane-bound Rotor & Stator)
- **Subunit a:** Contains two non-connecting half-channels for protons.
- **c-ring:** Cylindrical rotor containing essential Aspartic acid (Asp61) residues that accept protons from the intermembrane space channel and release them into the matrix channel after a full $360^\\circ$ rotation.

### The $F_1$ Subunit (Catalytic Headpiece in Matrix)
- Hexameric ring composed of alternating $(\\alpha\\beta)_3$ subunits.
- Paul Boyer's **Binding Change Mechanism**:
  1. **Open (O) Conformation:** Very low affinity for nucleotides; newly synthesized ATP dissociates.
  2. **Loose (L) Conformation:** Binds ADP and Inorganic Phosphate ($P_i$) loosely.
  3. **Tight (T) Conformation:** Catalyzes spontaneous formation of ATP without requiring external energy; mechanical rotation of the asymmetrical $\\gamma$ stalk induces conformation transitions.

---

## 3. Stoichiometry & P/O Ratios
- Complete oxidation of 1 molecule of cytosolic glucose yields:
  - **30 to 32 ATP** depending on the malate-aspartate vs. glycerol-3-phosphate shuttle.
  - P/O ratio for NADH oxidation: $\approx 2.5$
  - P/O ratio for FADH2 oxidation: $\approx 1.5$`,
    keyTakeaways: [
      "PMF combines both electrical charge delta psi and chemical delta pH across the inner mitochondrial membrane.",
      "ATP synthesis at the catalytic site does NOT require energy; proton translocation provides energy to RELEASE ATP from the Tight conformation.",
      "Rotation of the c-ring is driven by neutralization of Aspartate charges in hydrophobic lipid bilayer.",
      "Uncouplers like 2,4-DNP collapse delta pH without inhibiting electron transport chain, generating pure heat."
    ],
    flashcards: [
      {
        id: 'fc_bio_1',
        question: 'Which step in ATP synthesis actually requires the proton-motive force energy?',
        answer: 'The release of tightly bound ATP from the catalytic beta subunit (transition from Tight to Open state), NOT the condensation of ADP + Pi.'
      },
      {
        id: 'fc_bio_2',
        question: 'What is the effect of 2,4-Dinitrophenol (DNP) on cellular respiration and oxygen consumption?',
        answer: 'It acts as a proton ionophore, dissipating PMF: respiration and O2 consumption spike to maximum rate while ATP synthesis drops to zero.'
      }
    ],
    revisionChecklist: [
      { task: 'Trace proton flow through subunit a half-channels', completed: true },
      { task: 'Calculate net ATP yield with glycerol-3-phosphate shuttle', completed: true },
      { task: 'Memorize inhibitor targets: Oligomycin, Cyanide, Rotenone', completed: false }
    ],
    isForSale: true,
    price: 4.99,
    previewPercent: 50,
    isVerifiedContent: true,
    verificationType: 'TA Approved',
    salesCount: 64,
    rating: 4.99,
    reviewsCount: 29,
    reviews: [
      {
        id: 'rev_bio_1',
        userId: 'user_marcus',
        userName: 'Marcus Vance',
        userUniversity: 'Stanford University',
        rating: 5,
        comment: 'Elena is an actual TA at MIT and it shows. The Boyer binding mechanism breakdown is crystalline.',
        date: '2 days ago',
        verifiedBuyer: true
      }
    ],
    isCollaborative: true,
    collaboratorIds: ['user_marcus'],
    comments: [],
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-11-04T16:45:00Z'
  },
  {
    id: 'note_macro_monetary',
    title: 'Monetary Policy Transmission & Dynamic IS-LM-PC Framework',
    folderId: 'folder_econ102',
    authorId: 'user_jordan',
    authorName: 'Jordan Lee',
    authorHandle: '@jordan_berkeley',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    authorUniversity: 'UC Berkeley',
    authorVerified: true,
    authorBadge: 'Department Peer',
    courseCode: 'ECON 102',
    courseName: 'Macroeconomic Analysis',
    term: 'Fall 2026',
    subject: 'Economics',
    tags: ['Macroeconomics', 'Monetary Policy', 'IS-LM', 'Taylor Rule', 'Phillips Curve'],
    coverImage: '/src/assets/images/campus_library_hall_1794077808777.jpg',
    content: `# ECON 102: The Modern 3-Equation Macroeconomic Model

## 1. The IS Relation (Goods Market Equilibrium)
Output $Y$ is determined by aggregate demand as a function of real interest rate $r = i - \\pi^e$:

$$Y = C(Y - T) + I(Y, r + x) + G$$

Where $x$ is the financial risk premium demanded by private bondholders.

---

## 2. The Phillips Curve (Inflation Dynamics)
The accelerationist Phillips curve relates current inflation to expected inflation and output gap $(Y - Y_n)$:

$$\\pi - \\pi^e = \\frac{\\alpha}{L} (Y - Y_n)$$

Under anchored inflation expectations (modern inflation-targeting regime):
$$\\pi = \\bar{\\pi} + \\alpha (Y - Y_n)$$

---

## 3. The Central Bank Monetary Rule
Rather than setting money supply $M$, modern central banks target the policy rate $i$ via a Taylor Rule:

$$i = r^* + \\pi + 0.5(\\pi - \\pi^*) + 0.5\\left(\\frac{Y - Y^*}{Y^*}\\right)$$

When inflation exceeds target $\\pi^*$, the real rate $r$ must increase by more than 1-to-1 (the **Taylor Principle**), otherwise inflationary spirals develop.`,
    keyTakeaways: [
      "The Taylor Principle states that nominal interest rate must adjust more than one-for-one with changes in inflation to stabilize real rates.",
      "The zero lower bound (ZLB) on nominal interest rates transforms monetary policy into quantitative easing and forward guidance.",
      "Financial risk premium x shifts the IS curve leftward without any central bank interest rate hike."
    ],
    flashcards: [
      {
        id: 'fc_econ_1',
        question: 'What is the Taylor Principle and what happens if a central bank violates it?',
        answer: 'The central bank must raise nominal rates by more than 100 bps for each 100 bps rise in inflation. Violating it leads to negative real rates, accelerating inflation.'
      }
    ],
    revisionChecklist: [
      { task: 'Graph supply shock stagflation shift on IS-LM-PC grid', completed: true },
      { task: 'Derive sacrifice ratio for disinflation policies', completed: false }
    ],
    isForSale: true,
    price: 3.99,
    previewPercent: 45,
    isVerifiedContent: true,
    verificationType: 'Syllabus Aligned',
    salesCount: 22,
    rating: 4.88,
    reviewsCount: 8,
    reviews: [],
    isCollaborative: false,
    collaboratorIds: [],
    comments: [],
    createdAt: '2026-10-22T14:15:00Z',
    updatedAt: '2026-11-06T10:00:00Z'
  },
  {
    id: 'note_orgo_reactions',
    title: 'Carbonyl Chemistry: Aldol, Claisen, & Enolate Alkylation Mechanisms',
    folderId: 'folder_chem302',
    authorId: 'user_elena',
    authorName: 'Elena Rostova',
    authorHandle: '@elena_mit',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    authorUniversity: 'Harvard University / MIT',
    authorVerified: true,
    authorBadge: 'TA Approved',
    courseCode: 'CHEM 302',
    courseName: 'Advanced Organic Chemistry',
    term: 'Fall 2026',
    subject: 'Chemistry',
    tags: ['Organic Chemistry', 'Enolates', 'Aldol Addition', 'Reaction Mechanisms'],
    coverImage: '/src/assets/images/hero_academic_study_1794077808241.jpg',
    content: `# CHEM 302: Enolate Chemistry & Condensation Reactions

## 1. Thermodynamic vs. Kinetic Enolates
Deprotonation of unsymmetrical ketones yields two distinct enolate isomers:
- **Kinetic Enolate:** Formed with strong, sterically hindered base (LDA) at low temperature ($-78^\\circ\\text{C}$) in aprotic solvent (THF). Deprotonates the less substituted, less hindered alpha-carbon.
- **Thermodynamic Enolate:** Formed with weaker or unhindered base ($KOtBu, NaOEt$) at room temperature ($25^\\circ\\text{C}$) in protic solvent. Favors the more substituted, more stable alkene.

---

## 2. The Directed Aldol Reaction
Preventing self-condensation and multi-product mixtures:
1. Generate lithium enolate with 1.0 eq LDA at $-78^\\circ\\text{C}$.
2. Slowly drip in the second electrophilic aldehyde partner.
3. Warm to room temperature to form beta-hydroxy carbonyl (aldol addition) or heat with acid/base to drive dehydration to $\\alpha,\\beta$-unsaturated enone (aldol condensation).`,
    keyTakeaways: [
      "LDA at -78 C selectively gives kinetic enolates via irreversible deprotonation.",
      "Aldol condensation dehydration is driven by conjugation stability of alpha,beta-unsaturated product.",
      "Claisen condensation requires at least two alpha-protons on the ester to drive equilibrium via irreversible deprotonation of beta-keto ester."
    ],
    flashcards: [
      {
        id: 'fc_chem_1',
        question: 'Why does Claisen condensation fail for esters with only one alpha hydrogen?',
        answer: 'The final deprotonation step of the beta-keto ester (pKa ~11) that drives the overall equilibrium forward cannot take place.'
      }
    ],
    revisionChecklist: [
      { task: 'Draw Zimmermann-Traxler chair transition state for stereoselective aldol', completed: false }
    ],
    isForSale: false,
    price: 0,
    previewPercent: 100,
    isVerifiedContent: true,
    verificationType: 'A+ Grade Verified',
    salesCount: 112,
    rating: 4.97,
    reviewsCount: 34,
    reviews: [],
    isCollaborative: true,
    collaboratorIds: ['user_marcus'],
    comments: [],
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-11-01T12:00:00Z'
  },
  {
    id: 'note_linear_algebra_svd',
    title: 'Singular Value Decomposition (SVD), Principal Components & Pseudo-Inverse',
    folderId: 'folder_math215',
    authorId: 'user_marcus',
    authorName: 'Marcus Vance',
    authorHandle: '@marcus_stanford',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    authorUniversity: 'Stanford University',
    authorVerified: true,
    authorBadge: 'A+ Certified',
    courseCode: 'MATH 215',
    courseName: 'Applied Linear Algebra',
    term: 'Fall 2026',
    subject: 'Mathematics',
    tags: ['Linear Algebra', 'SVD', 'Eigenvalues', 'Matrix Theory', 'PCA'],
    coverImage: '/src/assets/images/cover_notes_algorithms_1794077808605.jpg',
    content: `# MATH 215: SVD & Geometric Matrix Transformations

## 1. SVD Theorem
Any real matrix $A \\in \\mathbb{R}^{m \\times n}$ can be factored into:
$$A = U \\Sigma V^T$$

Where:
- $U \\in \\mathbb{R}^{m \\times m}$ is orthogonal: left singular vectors (eigenvectors of $A A^T$).
- $\\Sigma \\in \\mathbb{R}^{m \\times n}$ is diagonal: singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r > 0$.
- $V \\in \\mathbb{R}^{n \\times n}$ is orthogonal: right singular vectors (eigenvectors of $A^T A$).

### Geometric Interpretation
SVD maps an $n$-dimensional unit sphere into an $m$-dimensional hyper-ellipsoid through:
1. Rotation in $\\mathbb{R}^n$ ($V^T$)
2. Scaling along principal axes by singular values ($\\Sigma$)
3. Rotation in $\\mathbb{R}^m$ ($U$)

---

## 2. Low-Rank Approximation (Eckart-Young-Mirsky Theorem)
The best rank-$k$ approximation of $A$ under both the Frobenius norm and spectral norm is given by truncating SVD:
$$A_k = \\sum_{i=1}^{k} \\sigma_i u_i v_i^T$$
Error: $\\|A - A_k\\|_2 = \\sigma_{k+1}$. This forms the mathematical basis for lossy image compression, dimensionality reduction, and latent semantic indexing.`,
    keyTakeaways: [
      "Singular values are square roots of the eigenvalues of A^T A.",
      "The rank of matrix A equals the number of strictly positive singular values.",
      "The Moore-Penrose pseudo-inverse is effortlessly computed as A^+ = V Sigma^+ U^T.",
      "Condition number kappa(A) = sigma_max / sigma_min governs numerical stability in matrix inversion."
    ],
    flashcards: [
      {
        id: 'fc_math_1',
        question: 'What is the connection between SVD and Principal Component Analysis (PCA)?',
        answer: 'PCA is computed directly by performing SVD on the mean-centered data matrix X: right singular vectors V are the principal component directions.'
      }
    ],
    revisionChecklist: [
      { task: 'Compute 2x2 matrix SVD by hand for midterm', completed: true },
      { task: 'Verify orthogonality of U and V vectors', completed: true }
    ],
    isForSale: true,
    price: 5.50,
    previewPercent: 40,
    isVerifiedContent: true,
    verificationType: 'A+ Grade Verified',
    salesCount: 45,
    rating: 4.94,
    reviewsCount: 14,
    reviews: [],
    isCollaborative: false,
    collaboratorIds: [],
    comments: [],
    createdAt: '2026-10-10T15:30:00Z',
    updatedAt: '2026-11-03T18:10:00Z'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    type: 'sale',
    amount: 6.50,
    netAmount: 6.18,
    fee: 0.32,
    noteId: 'note_algo_graphs',
    noteTitle: 'Graph Traversal & Shortest Path: Dijkstra, Bellman-Ford, & A*',
    senderHandle: '@alex_berkeley',
    recipientHandle: '@marcus_stanford',
    description: 'Peer purchase: Graph Traversal Notes (CS 161)',
    timestamp: '2 hours ago',
    status: 'completed',
    referenceId: 'NN-TX-9821-CS'
  },
  {
    id: 'tx_002',
    type: 'sale',
    amount: 4.99,
    netAmount: 4.74,
    fee: 0.25,
    noteId: 'note_chemiosmosis',
    noteTitle: 'Cellular Respiration & Chemiosmosis',
    senderHandle: '@david_premed',
    recipientHandle: '@elena_mit',
    description: 'Peer purchase: Cellular Respiration (BIOL 701)',
    timestamp: '5 hours ago',
    status: 'completed',
    referenceId: 'NN-TX-8412-BIO'
  },
  {
    id: 'tx_003',
    type: 'tip_received',
    amount: 10.00,
    netAmount: 9.50,
    fee: 0.50,
    senderHandle: '@sophia_stanford',
    recipientHandle: '@marcus_stanford',
    description: 'Final exam study tip from peer study group',
    timestamp: 'Yesterday',
    status: 'completed',
    referenceId: 'NN-TX-7341-TIP'
  },
  {
    id: 'tx_004',
    type: 'deposit',
    amount: 50.00,
    netAmount: 50.00,
    fee: 0.00,
    description: 'Campus wallet reload via Student Debit Card',
    timestamp: '3 days ago',
    status: 'completed',
    referenceId: 'NN-TX-1104-DEP'
  }
];
