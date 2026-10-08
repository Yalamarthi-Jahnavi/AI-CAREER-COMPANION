/**
 * Current Technology Practice API & Question Engine
 * Contains extensive question sets for:
 * Python, React, JavaScript, SQL, AWS, Docker, Machine Learning, RAG
 * Across question types: Multiple Choice, True/False, Code Output, Debugging, Scenario Based, Conceptual, Practical, Architecture.
 */

export const TECHNOLOGIES_LIST = [
  { id: 'python', name: 'Python', icon: '🐍', color: '#38bdf8', category: 'Programming', desc: 'Data structures, OOP, decorators & algorithms', level: 'Beginner to Advanced' },
  { id: 'javascript', name: 'JavaScript', icon: '💛', color: '#facc15', category: 'Programming', desc: 'Promises, async/await, closures & DOM mechanics', level: 'Beginner to Advanced' },
  { id: 'react', name: 'React', icon: '⚛️', color: '#60a5fa', category: 'Frontend', desc: 'Hooks, component lifecycle & state management', level: 'Intermediate to Advanced' },
  { id: 'java', name: 'Java', icon: '☕', color: '#f97316', category: 'Backend', desc: 'JVM, OOP, collections & multithreading', level: 'Intermediate to Advanced' },
  { id: 'cpp', name: 'C / C++', icon: '⚙️', color: '#6366f1', category: 'Systems', desc: 'Pointers, memory layout, STL & low-level design', level: 'Intermediate to Advanced' },
  { id: 'sql', name: 'SQL', icon: '🗄️', color: '#a855f7', category: 'Database', desc: 'Queries, schema design, joins & performance indexing', level: 'Beginner to Advanced' },
  { id: 'aws', name: 'AWS', icon: '☁️', color: '#fbbf24', category: 'Cloud', desc: 'S3, Lambda, EC2, IAM, DynamoDB & VPC architectures', level: 'Intermediate to Advanced' },
  { id: 'docker', name: 'Docker', icon: '🐳', color: '#0ea5e9', category: 'DevOps', desc: 'Containers, multi-stage builds, volumes & Compose', level: 'Beginner to Advanced' },
  { id: 'machine-learning', name: 'Machine Learning', icon: '🧠', color: '#ec4899', category: 'AI/ML', desc: 'Supervised/unsupervised, loss functions & neural nets', level: 'Intermediate to Advanced' },
  { id: 'rag', name: 'AI / LLMs & RAG', icon: '🤖', color: '#06b6d4', category: 'Generative AI', desc: 'Retrieval augmented generation, embeddings & prompt design', level: 'Advanced' },
]

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
export const QUESTION_COUNTS = [5, 10, 15, 20]
export const DURATIONS = [
  { minutes: 5, label: '5 minutes (Blitz)' },
  { minutes: 10, label: '10 minutes (Standard)' },
  { minutes: 20, label: '20 minutes (Comprehensive)' },
  { minutes: 30, label: '30 minutes (Deep Dive)' },
]

/**
 * Rich Question Bank
 */
const QUESTION_BANK = {
  // ─── PYTHON ──────────────────────────────────────────────────
  python: [
    {
      id: 'py-1',
      type: 'Code Output',
      topic: 'Data structures & Mutability',
      difficulty: 'Intermediate',
      question: 'What is the output of the following Python code snippet?',
      code: `def append_to_list(val, my_list=[]):\n    my_list.append(val)\n    return my_list\n\nprint(append_to_list(1))\nprint(append_to_list(2))`,
      options: ['[1] and [2]', '[1] and [1, 2]', '[1] and [1]', 'TypeError: mutable default argument'],
      correctAnswer: 1,
      explanation: 'In Python, default parameter values are evaluated once when the function definition is executed, not each time the function is called. The default list is shared across calls.',
    },
    {
      id: 'py-2',
      type: 'Conceptual',
      topic: 'GIL & Concurrency',
      difficulty: 'Advanced',
      question: 'Which statement accurately describes the Global Interpreter Lock (GIL) in standard CPython?',
      code: null,
      options: [
        'It prevents multiple processes from running simultaneously on multicore CPUs.',
        'It is a mutex that prevents multiple native threads from executing Python bytecodes concurrently.',
        'It guarantees full thread safety for all custom user data structures.',
        'It only activates when running asynchronous coroutines with AsyncIO.',
      ],
      correctAnswer: 1,
      explanation: 'The CPython GIL is a mutual exclusion lock used to prevent multiple native OS threads from executing Python bytecodes at the same time, simplifying C-extension thread safety and reference counting.',
    },
    {
      id: 'py-3',
      type: 'Debugging',
      topic: 'Exceptions & Error Handling',
      difficulty: 'Beginner',
      question: 'Identify the bug in the following exception-handling structure:',
      code: `try:\n    x = 10 / int(user_input)\nexcept Exception as e:\n    print("General Error")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")`,
      options: [
        'ZeroDivisionError will never be caught because Exception catches it first.',
        'The variable `e` must be explicitly deleted.',
        'ZeroDivisionError is not a valid built-in exception.',
        'try block requires an `else` block to catch division.',
      ],
      correctAnswer: 0,
      explanation: 'Because `ZeroDivisionError` subclasses `Exception`, placing `except Exception` before `except ZeroDivisionError` shadows the more specific handler, making the second block unreachable.',
    },
    {
      id: 'py-4',
      type: 'Practical',
      topic: 'OOP & Dunder Methods',
      difficulty: 'Intermediate',
      question: 'Which dunder method should you implement to define the behavior of `len(obj)` in a custom Python class?',
      code: null,
      options: ['__size__(self)', '__length__(self)', '__len__(self)', '__count__(self)'],
      correctAnswer: 2,
      explanation: 'The `__len__(self)` special method is invoked by the built-in `len()` function and must return a non-negative integer.',
    },
    {
      id: 'py-5',
      type: 'True/False',
      topic: 'Data structures',
      difficulty: 'Beginner',
      question: 'In Python 3.7+, standard dictionary (`dict`) keys maintain insertion order.',
      code: null,
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'True. In Python 3.7+, insertion-order preservation of dict keys is a guaranteed language specification.',
    },
    {
      id: 'py-6',
      type: 'Code Output',
      topic: 'Functions & Scope',
      difficulty: 'Intermediate',
      question: 'What does this generator expression output?',
      code: `gen = (x * 2 for x in range(3))\nlist1 = list(gen)\nlist2 = list(gen)\nprint(list1, list2)`,
      options: ['[0, 2, 4] [0, 2, 4]', '[0, 2, 4] []', '[] [0, 2, 4]', 'RuntimeError: Generator already consumed'],
      correctAnswer: 1,
      explanation: 'Generators in Python are one-time iterators. Once fully consumed into `list1`, the generator is exhausted, so converting it to `list2` yields an empty list `[]`.',
    },
    {
      id: 'py-7',
      type: 'Architecture',
      topic: 'AsyncIO & Concurrency',
      difficulty: 'Advanced',
      question: 'In an I/O-bound web service using FastAPI with AsyncIO, which approach should you take when executing a blocking, CPU-intensive image resizing function?',
      code: null,
      options: [
        'Call it directly in the async route handler with `await`.',
        'Offload it to a worker thread using `asyncio.to_thread()` or a ProcessPoolExecutor.',
        'Use `asyncio.sleep(0)` immediately before calling the function.',
        'Convert the image resizing function into a generator.',
      ],
      correctAnswer: 1,
      explanation: 'Calling a blocking CPU-heavy task directly in an async function blocks the main event loop for all concurrent requests. Offloading to `asyncio.to_thread` or a ProcessPool keeps the event loop responsive.',
    },
  ],

  // ─── REACT ───────────────────────────────────────────────────
  react: [
    {
      id: 'react-1',
      type: 'Multiple Choice',
      topic: 'Hooks & State',
      difficulty: 'Intermediate',
      question: 'What happens when you call `setState(prevState => prevState + 1)` versus `setState(state + 1)` multiple times synchronously in the same event handler?',
      code: null,
      options: [
        'There is no difference; React updates the DOM on every call.',
        'The updater function guarantees access to the latest queued state, preventing stale batching overwrites.',
        'The functional updater forces a synchronous browser reflow.',
        'The functional updater is deprecated in React 18+.',
      ],
      correctAnswer: 1,
      explanation: 'Using the updater function `prevState => ...` queues state transitions sequentially, ensuring each update builds on the resolved value of the prior update within React batching.',
    },
    {
      id: 'react-2',
      type: 'Code Output',
      topic: 'Lifecycle & useEffect',
      difficulty: 'Intermediate',
      question: 'In what order will the console messages appear on initial component mount?',
      code: `function Test() {\n  console.log("Render");\n  useEffect(() => {\n    console.log("Effect");\n    return () => console.log("Cleanup");\n  }, []);\n  return <div>Test</div>;\n}`,
      options: ['Effect -> Render', 'Render -> Effect', 'Render -> Cleanup -> Effect', 'Effect -> Cleanup -> Render'],
      correctAnswer: 1,
      explanation: 'During mount, the component function executes first ("Render"). After the DOM has painted, the `useEffect` callback runs ("Effect"). Cleanup only runs on unmount or prior to re-running the effect.',
    },
    {
      id: 'react-3',
      type: 'Debugging',
      topic: 'Hooks Dependencies',
      difficulty: 'Intermediate',
      question: 'What is the primary bug in this effect hook?',
      code: `useEffect(() => {\n  const interval = setInterval(() => {\n    setCount(count + 1);\n  }, 1000);\n  return () => clearInterval(interval);\n}, []);`,
      options: [
        'The interval variable must be attached to `window`.',
        '`count` is captured in a stale closure, resulting in `count` never advancing past 1.',
        '`setInterval` is not allowed inside `useEffect`.',
        '`clearInterval` must be called with `await`.',
      ],
      correctAnswer: 1,
      explanation: 'Because the dependency array is empty `[]`, the effect callback captures the initial `count` (0) in a stale closure. Every tick executes `setCount(0 + 1)`. Using `setCount(c => c + 1)` solves this.',
    },
    {
      id: 'react-4',
      type: 'Scenario Based',
      topic: 'Context API & Performance',
      difficulty: 'Advanced',
      question: 'A large React application experiences unnecessary re-renders in deeply nested components consuming a shared theme/auth context. What is the most effective architectural fix?',
      code: null,
      options: [
        'Replace all components with class components.',
        'Split the context into separate smaller contexts (e.g., ThemeContext, UserContext) and memoize consumer subtrees with React.memo.',
        'Wrap the entire root tree inside `useLayoutEffect`.',
        'Pass all state through URL query parameters instead of Context.',
      ],
      correctAnswer: 1,
      explanation: 'Any change to a context value causes all consuming components to re-render. Splitting monolithic contexts into domain-specific contexts prevents unrelated state updates from cascading.',
    },
    {
      id: 'react-5',
      type: 'Architecture',
      topic: 'React 19 Server Components',
      difficulty: 'Advanced',
      question: 'What is a core benefit of React Server Components (RSC) compared to traditional client-side components?',
      code: null,
      options: [
        'RSC eliminates the need for any CSS stylesheets.',
        'RSC execute on the server, zeroing out their code from the client JavaScript bundle and allowing direct database/filesystem access.',
        'RSC allow client hooks like `useState` and `useEffect` to execute on the server.',
        'RSC convert client components to WebAssembly.',
      ],
      correctAnswer: 1,
      explanation: 'Server Components stay on the server and do not add to client bundle size, while having direct server-side access to microservices, databases, and secrets.',
    },
    {
      id: 'react-6',
      type: 'True/False',
      topic: 'Props & Immutability',
      difficulty: 'Beginner',
      question: 'In React, component props are read-only and must never be modified directly by a child component.',
      code: null,
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'True. React adheres to strict unidirectional data flow. Props are immutable inputs; modifying them directly violates React principles.',
    },
  ],

  // ─── SQL ─────────────────────────────────────────────────────
  sql: [
    {
      id: 'sql-1',
      type: 'Multiple Choice',
      topic: 'Joins',
      difficulty: 'Beginner',
      question: 'Which SQL JOIN returns all records from the left table, along with matched records from the right table, filling with NULL where there is no match?',
      code: null,
      options: ['INNER JOIN', 'LEFT OUTER JOIN', 'FULL JOIN', 'CROSS JOIN'],
      correctAnswer: 1,
      explanation: 'A LEFT OUTER JOIN returns every row from the left table. If no matching row exists in the right table, columns from the right table evaluate to NULL.',
    },
    {
      id: 'sql-2',
      type: 'Code Output',
      topic: 'Aggregation & GROUP BY',
      difficulty: 'Intermediate',
      question: 'Which clause is required to filter aggregated groups (e.g., show only departments with more than 5 employees)?',
      code: `SELECT dept_id, COUNT(*) \nFROM employees \nGROUP BY dept_id \n??? COUNT(*) > 5;`,
      options: ['WHERE', 'HAVING', 'FILTER', 'LIMIT'],
      correctAnswer: 1,
      explanation: '`WHERE` filters rows before aggregation, whereas `HAVING` filters grouped rows after aggregation.',
    },
    {
      id: 'sql-3',
      type: 'Scenario Based',
      topic: 'Indexes & Query Optimization',
      difficulty: 'Advanced',
      question: 'A table `orders` has 10 million rows. Queries frequently run `SELECT * FROM orders WHERE customer_id = 42 ORDER BY order_date DESC`. Which index will provide the best performance?',
      code: null,
      options: [
        'Single column index on `order_date`',
        'Composite B-Tree index on `(customer_id, order_date DESC)`',
        'Hash index on `customer_id`',
        'Full-text search index on `(customer_id)`',
      ],
      correctAnswer: 1,
      explanation: 'A composite index on `(customer_id, order_date DESC)` allows the database to filter by customer and read the ordered data directly from the index tree without a separate Sort operation.',
    },
    {
      id: 'sql-4',
      type: 'Conceptual',
      topic: 'Transactions & ACID',
      difficulty: 'Intermediate',
      question: 'In the ACID database model, what does the "I" (Isolation) ensure?',
      code: null,
      options: [
        'Data is distributed across isolated servers.',
        'Concurrent transactions do not interfere with each other or observe inconsistent intermediate states.',
        'Data is encrypted at rest in isolated tables.',
        'Queries are compiled into isolated machine bytecode.',
      ],
      correctAnswer: 1,
      explanation: 'Isolation ensures that concurrent transactions execute as if they were running sequentially, avoiding dirty reads, non-repeatable reads, and phantom reads depending on isolation level.',
    },
    {
      id: 'sql-5',
      type: 'Code Output',
      topic: 'Window Functions',
      difficulty: 'Advanced',
      question: 'What does the `ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)` window function do?',
      code: null,
      options: [
        'It calculates the average salary for each department.',
        'It assigns a unique sequential integer (1, 2, 3...) to employees within each department, ordered by highest salary first.',
        'It filters the table to return only the single highest earner across the entire company.',
        'It combines multiple rows into a single JSON array.',
      ],
      correctAnswer: 1,
      explanation: '`PARTITION BY dept_id` divides rows into departmental groups, and `ROW_NUMBER()` ranks each employee sequentially starting at 1 based on descending salary.',
    },
  ],

  // ─── AWS ─────────────────────────────────────────────────────
  aws: [
    {
      id: 'aws-1',
      type: 'Multiple Choice',
      topic: 'IAM & Security',
      difficulty: 'Beginner',
      question: 'According to AWS IAM best practices, how should you grant permissions to an EC2 instance to access an S3 bucket?',
      code: null,
      options: [
        'Hardcode the AWS Root Access Keys inside the application config.',
        'Store IAM user credentials in a public environment variable.',
        'Attach an IAM Role with an appropriate IAM Policy directly to the EC2 instance profile.',
        'Open the S3 bucket policy to public read/write.',
      ],
      correctAnswer: 2,
      explanation: 'Attaching an IAM Role to the EC2 instance profile enables secure, automatic credential rotation via the AWS Instance Metadata Service without static credentials.',
    },
    {
      id: 'aws-2',
      type: 'Scenario Based',
      topic: 'S3 & Storage Classes',
      difficulty: 'Intermediate',
      question: 'Your company has regulatory compliance data that is rarely accessed after 90 days, but must be retrievable within milliseconds if an audit occurs. Which S3 storage class is most cost-effective?',
      code: null,
      options: ['S3 Standard', 'S3 Glacier Flexible Retrieval', 'S3 Standard-Infrequent Access (S3 Standard-IA)', 'S3 Glacier Deep Archive'],
      correctAnswer: 2,
      explanation: 'S3 Standard-IA is designed for data accessed less frequently, but requires rapid millisecond access when requested, at a significantly lower storage cost than S3 Standard.',
    },
    {
      id: 'aws-3',
      type: 'Architecture',
      topic: 'VPC & Networking',
      difficulty: 'Advanced',
      question: 'How do EC2 instances in a private subnet securely download software patches from the Internet without allowing unsolicited incoming Internet traffic?',
      code: null,
      options: [
        'Attach an Internet Gateway directly to the private subnet route table.',
        'Route outbound Internet traffic (0.0.0.0/0) to a NAT Gateway located in a public subnet.',
        'Assign public IPv4 addresses to each private instance.',
        'Enable VPC Peering with another private subnet.',
      ],
      correctAnswer: 1,
      explanation: 'A NAT (Network Address Translation) Gateway in a public subnet allows private subnet instances to initiate outbound connections while blocking all incoming Internet-initiated traffic.',
    },
    {
      id: 'aws-4',
      type: 'Conceptual',
      topic: 'Serverless & Lambda',
      difficulty: 'Intermediate',
      question: 'What is a "Cold Start" in AWS Lambda?',
      code: null,
      options: [
        'The time it takes for an EC2 server to physically power on in a datacenter.',
        'The latency incurred when Lambda provisions a new container environment and initializes runtime code for an incoming invocation.',
        'An error thrown when a Lambda function runs out of memory.',
        'The automatic retry delay after a function crash.',
      ],
      correctAnswer: 1,
      explanation: 'A cold start occurs when an invocation triggers initialization of a new execution environment (downloading code, starting the runtime container, running global init code).',
    },
  ],

  // ─── DOCKER ──────────────────────────────────────────────────
  docker: [
    {
      id: 'docker-1',
      type: 'Multiple Choice',
      topic: 'Dockerfile & Multi-stage',
      difficulty: 'Intermediate',
      question: 'What is the primary benefit of multi-stage Docker builds?',
      code: null,
      options: [
        'Running multiple OS kernels in one container simultaneously.',
        'Separating the build-time dependencies from the final lightweight production runtime image.',
        'Increasing the number of open network ports on a container.',
        'Allowing Docker Compose to deploy directly to Kubernetes without YAML.',
      ],
      correctAnswer: 1,
      explanation: 'Multi-stage builds allow you to use a heavy SDK image to compile code, and copy only the compiled binaries into a minimal base image (e.g., Alpine or Distroless), reducing image size and attack surface.',
    },
    {
      id: 'docker-2',
      type: 'Debugging',
      topic: 'Layer Caching',
      difficulty: 'Intermediate',
      question: 'Why is this Dockerfile inefficient for caching during development?',
      code: `FROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]`,
      options: [
        '`WORKDIR` cannot be set to `/app`.',
        'Copying all source files before `npm install` invalidates the dependency cache on every single code edit.',
        '`npm install` must be prefixed with `sudo`.',
        '`CMD` requires single quotes.',
      ],
      correctAnswer: 1,
      explanation: 'By copying `package.json` and running `npm install` first, Docker caches the installed dependencies. Copying the entire directory first causes any source code change to bust the cache, re-running `npm install`.',
    },
    {
      id: 'docker-3',
      type: 'Conceptual',
      topic: 'Volumes & Persistence',
      difficulty: 'Beginner',
      question: 'What happens to data written inside a container writable layer when the container is deleted without using volumes?',
      code: null,
      options: [
        'The data is automatically backed up to Docker Hub.',
        'The data is permanently lost.',
        'The data is moved to the host `/tmp` directory.',
        'The container becomes read-only and cannot be deleted.',
      ],
      correctAnswer: 1,
      explanation: 'Container storage is ephemeral by default. When a container is removed, its writable layer is discarded unless backed by a Docker volume or bind mount.',
    },
    {
      id: 'docker-4',
      type: 'Architecture',
      topic: 'Linux Namespaces & cgroups',
      difficulty: 'Advanced',
      question: 'Which underlying Linux kernel mechanism is responsible for isolating process trees (`PID`), network interfaces (`NET`), and mount points (`MNT`) in Docker?',
      code: null,
      options: ['cgroups (Control Groups)', 'Linux Namespaces', 'AppArmor', 'iptables'],
      correctAnswer: 1,
      explanation: 'Linux Namespaces provide process and resource isolation (PID, NET, MNT, IPC, UTS, USER). Control Groups (cgroups) govern resource allocation limits (CPU, RAM, I/O).',
    },
  ],

  // ─── AI / ML / RAG ───────────────────────────────────────────
  rag: [
    {
      id: 'rag-1',
      type: 'Conceptual',
      topic: 'Vector Embeddings',
      difficulty: 'Intermediate',
      question: 'What does a text embedding model output when passed a chunk of document text?',
      code: null,
      options: [
        'An encrypted SHA-256 hash string.',
        'A high-dimensional dense vector of floating-point numbers capturing semantic meaning.',
        'A list of SQL table column names.',
        'A summarized Markdown bullet list.',
      ],
      correctAnswer: 1,
      explanation: 'Embedding models map semantic concepts into dense high-dimensional vectors (e.g., 768 or 1536 dimensions) where mathematically close vectors represent semantically similar concepts.',
    },
    {
      id: 'rag-2',
      type: 'Architecture',
      topic: 'Hybrid Search in RAG',
      difficulty: 'Advanced',
      question: 'Why is Hybrid Search (combining Dense Vector Search with Sparse BM25 Keyword Search) considered best practice in enterprise RAG systems?',
      code: null,
      options: [
        'Vector search alone cannot run on GPUs.',
        'Dense search captures conceptual semantics, while BM25 handles exact keyword matches (like SKU numbers, error codes, and acronyms) that embeddings often blur.',
        'BM25 eliminates the need for any chunking.',
        'Hybrid search automatically fine-tunes the LLM weights on every query.',
      ],
      correctAnswer: 1,
      explanation: 'Vector search is great for meaning and synonyms, but often struggles with exact unique identifiers, part numbers, or uncommon code identifiers where traditional BM25 keyword matching excels.',
    },
    {
      id: 'rag-3',
      type: 'Scenario Based',
      topic: 'Context Window & Hallucinations',
      difficulty: 'Intermediate',
      question: 'An LLM returns inaccurate answers despite relevant chunks being retrieved from the vector database. What is a primary phenomenon that could explain this?',
      code: null,
      options: [
        '"Lost in the Middle" — LLMs pay higher attention to information at the very beginning and end of long context prompts than the middle.',
        'Vector databases permanently truncate cosine similarity above 0.5.',
        'Embedding models cannot process nouns.',
        'RAG is only compatible with open-source LLMs.',
      ],
      correctAnswer: 0,
      explanation: 'Research demonstrates the "Lost in the Middle" phenomenon: LLMs degrade in retrieval accuracy when relevant evidence is sandwiched deep in the middle of a massive context window.',
    },
    {
      id: 'rag-4',
      type: 'Practical',
      topic: 'Reranking & Cross-Encoders',
      difficulty: 'Advanced',
      question: 'What role does a Cross-Encoder (Reranker) play in a two-stage RAG pipeline?',
      code: null,
      options: [
        'It translates the query into multiple spoken languages.',
        'It scores the full query-document pair together, providing a higher-accuracy relevance score for the top-k retrieved candidates before passing to the generator LLM.',
        'It compresses the text into a zip archive.',
        'It automatically executes Python code from the retrieved documents.',
      ],
      correctAnswer: 1,
      explanation: 'Bi-encoders (fast vector search) retrieve an initial candidate pool (e.g. top 50), and a Cross-Encoder reranker calculates full joint attention to pick the absolute most relevant top 5 for the prompt.',
    },
  ],

  'machine-learning': [
    {
      id: 'ml-1',
      type: 'Conceptual',
      topic: 'Bias-Variance Tradeoff',
      difficulty: 'Beginner',
      question: 'What does a high training accuracy combined with significantly lower test accuracy typically indicate in machine learning?',
      code: null,
      options: ['Underfitting (High Bias)', 'Overfitting (High Variance)', 'Optimal generalization', 'Data leakage in the test set'],
      correctAnswer: 1,
      explanation: 'High training score paired with poor validation/test score indicates the model has memorized training noise rather than generalizing (Overfitting / High Variance).',
    },
    {
      id: 'ml-2',
      type: 'Multiple Choice',
      topic: 'Loss Functions',
      difficulty: 'Intermediate',
      question: 'Which loss function is standard for multi-class classification tasks using a softmax output layer?',
      code: null,
      options: ['Mean Squared Error (MSE)', 'Categorical Cross-Entropy', 'Hinge Loss', 'Huber Loss'],
      correctAnswer: 1,
      explanation: 'Categorical Cross-Entropy measures the distance between the true one-hot probability distribution and the predicted softmax probabilities.',
    },
    {
      id: 'ml-3',
      type: 'Conceptual',
      topic: 'Regularization',
      difficulty: 'Intermediate',
      question: 'What is the key difference between L1 (Lasso) and L2 (Ridge) regularization?',
      code: null,
      options: [
        'L1 adds a penalty proportional to the square of weights; L2 adds a penalty proportional to the absolute value.',
        'L1 can drive feature weights to exactly zero (sparse models); L2 shrinks weights uniformly towards zero but rarely reaches it.',
        'L2 is only applicable to logistic regression; L1 is for linear models.',
        'There is no functional difference — both produce identical models.',
      ],
      correctAnswer: 1,
      explanation: 'L1 regularization adds |w| to the loss, which can produce sparse models with exact zeros (useful for feature selection). L2 adds w² which shrinks all weights proportionally, rarely eliminating them.',
    },
    {
      id: 'ml-4',
      type: 'Scenario Based',
      topic: 'Cross-Validation',
      difficulty: 'Intermediate',
      question: 'You are tuning a Random Forest hyperparameter using the same test set repeatedly to pick the best result. What critical problem does this introduce?',
      code: null,
      options: [
        'Gradient vanishing — weights become too small.',
        'Data leakage — the test set information bleeds into model selection, making reported performance overoptimistic.',
        'Underfitting — the model sees too little training data.',
        'None — using the test set for tuning is recommended practice.',
      ],
      correctAnswer: 1,
      explanation: 'Using the test set to guide hyperparameter tuning effectively makes it part of the training process. The model is implicitly optimized for that specific test set, inflating apparent performance.',
    },
    {
      id: 'ml-5',
      type: 'Multiple Choice',
      topic: 'Evaluation Metrics',
      difficulty: 'Intermediate',
      question: 'In a fraud detection model where only 0.1% of transactions are fraud, what metric is most informative about model quality?',
      code: null,
      options: [
        'Accuracy',
        'Precision-Recall AUC (PR-AUC)',
        'Mean Squared Error',
        'R-squared',
      ],
      correctAnswer: 1,
      explanation: 'With extreme class imbalance, accuracy is misleading (99.9% accuracy by predicting "not fraud" always). PR-AUC focuses on the minority class and balances precision and recall tradeoffs.',
    },
    {
      id: 'ml-6',
      type: 'Conceptual',
      topic: 'Gradient Descent',
      difficulty: 'Advanced',
      question: 'What is the difference between Batch Gradient Descent, Stochastic Gradient Descent (SGD), and Mini-Batch Gradient Descent?',
      code: null,
      options: [
        'Batch uses all training data per update; SGD uses one sample; Mini-Batch uses a small random subset — offering a balance of stability and computation.',
        'SGD uses all data; Batch uses one sample; Mini-Batch uses 50% of data.',
        'All three are identical but differ only in memory allocation strategy.',
        'Batch is used for classification; SGD for regression; Mini-Batch for clustering.',
      ],
      correctAnswer: 0,
      explanation: 'Batch GD is stable but slow for large datasets. SGD is noisy but fast. Mini-Batch is the industry standard — computing gradients on small batches provides good parallelism and stable convergence.',
    },
    {
      id: 'ml-7',
      type: 'Architecture',
      topic: 'Neural Network Activation',
      difficulty: 'Advanced',
      question: 'Why is the ReLU activation function preferred over Sigmoid in deep hidden layers of neural networks?',
      code: null,
      options: [
        'ReLU normalizes outputs between 0 and 1 just like Sigmoid.',
        'ReLU mitigates the vanishing gradient problem since its gradient is 1 for positive inputs, enabling deeper networks to train effectively.',
        'Sigmoid has faster computation than ReLU.',
        'ReLU eliminates the need for backpropagation.',
      ],
      correctAnswer: 1,
      explanation: 'Sigmoid squashes values into [0,1], causing very small gradients in deep layers (vanishing gradients). ReLU outputs f(x)=max(0,x) with a constant gradient of 1 for positive values, allowing gradients to flow more freely.',
    },
  ],

  javascript: [
    {
      id: 'js-1',
      type: 'Code Output',
      topic: 'Event Loop & Microtasks',
      difficulty: 'Intermediate',
      question: 'What is logged to the console by the following script?',
      code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
      options: ['1, 2, 3, 4', '1, 4, 2, 3', '1, 4, 3, 2', '1, 3, 4, 2'],
      correctAnswer: 2,
      explanation: 'Synchronous code runs first (1, 4). Microtask queue (Promise .then) executes before the macrotask queue (setTimeout), so 3 logs before 2. Result: 1, 4, 3, 2.',
    },
    {
      id: 'js-2',
      type: 'Conceptual',
      topic: 'Prototypes & Closures',
      difficulty: 'Intermediate',
      question: 'What creates a closure in JavaScript?',
      code: null,
      options: [
        'Any function that returns a boolean value.',
        'A function bundled together with references to its surrounding lexical state (scope).',
        'An arrow function that uses the `this` keyword.',
        'A script running inside a Web Worker.',
      ],
      correctAnswer: 1,
      explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment), giving access to an outer function’s scope from an inner function.',
    },
    {
      id: 'js-3',
      type: 'Debugging',
      topic: 'Object Mutability & Reference',
      difficulty: 'Intermediate',
      question: 'What will be printed to the console?',
      code: `const user = { name: 'Alice', details: { age: 25 } };\nconst copy = { ...user };\ncopy.details.age = 30;\nconsole.log(user.details.age);`,
      options: ['25', '30', 'undefined', 'TypeError: cannot mutate copy'],
      correctAnswer: 1,
      explanation: 'The spread operator performs a shallow copy. Nested objects like `details` are copied by reference, so mutating `copy.details.age` also mutates `user.details.age`.',
    },
    {
      id: 'js-4',
      type: 'Conceptual',
      topic: 'this & Arrow Functions',
      difficulty: 'Intermediate',
      question: 'Why does the following code print `undefined` for `this.name`?',
      code: `const timer = {\n  name: 'MyTimer',\n  start: function() {\n    setTimeout(function() {\n      console.log(this.name);\n    }, 100);\n  }\n};\ntimer.start();`,
      options: [
        'setTimeout is asynchronous and cannot access object properties.',
        'Regular function callbacks have their own `this` binding; inside setTimeout, `this` refers to the global object (or undefined in strict mode), not `timer`.',
        'Arrow functions would also have the same result.',
        '`name` is a reserved property on the global object.',
      ],
      correctAnswer: 1,
      explanation: 'Regular functions create their own `this` context. Inside a setTimeout callback, `this` defaults to `window` (or undefined in strict mode). Replacing with an arrow function inherits the lexical `this` from `start`.',
    },
    {
      id: 'js-5',
      type: 'Code Output',
      topic: 'Scope & Hoisting',
      difficulty: 'Advanced',
      question: 'What is the output of this JavaScript code?',
      code: `var x = 1;\nfunction outer() {\n  var x = 2;\n  function inner() {\n    console.log(x);\n    var x = 3;\n  }\n  inner();\n}\nouter();`,
      options: ['1', '2', '3', 'undefined'],
      correctAnswer: 3,
      explanation: '`var` declarations are hoisted to the top of their function scope, but not their assignments. Inside `inner()`, `var x` is hoisted and initialized to `undefined` before `console.log(x)` executes.',
    },
    {
      id: 'js-6',
      type: 'Practical',
      topic: 'Promises & Async/Await',
      difficulty: 'Intermediate',
      question: 'What is the correct way to handle errors from an `async` function using `await`?',
      code: null,
      options: [
        'Wrap the `await` call in a `try...catch` block to catch both synchronous throws and rejected Promises.',
        'Attach `.catch()` directly to the `await` keyword.',
        'Use `Promise.catch()` on the function return value inside the async function.',
        'Errors in async functions are silently swallowed and cannot be caught.',
      ],
      correctAnswer: 0,
      explanation: '`await` unwraps rejected Promises as thrown exceptions. Wrapping `await` in `try...catch` is the idiomatic way to handle both sync errors and async rejections in async/await code.',
    },
    {
      id: 'js-7',
      type: 'Architecture',
      topic: 'Memory & Garbage Collection',
      difficulty: 'Advanced',
      question: 'Which of the following patterns is the most common cause of memory leaks in JavaScript single-page applications?',
      code: null,
      options: [
        'Using `let` instead of `const` for variable declarations.',
        'Event listeners attached to DOM nodes that are removed from the DOM but whose references are still held in JavaScript closures.',
        'Calling `JSON.stringify()` on large objects.',
        'Creating arrow functions inside `map()` callbacks.',
      ],
      correctAnswer: 1,
      explanation: 'When a DOM node is removed but an event listener still references it via a closure, neither the listener nor the node can be garbage-collected. Always call `removeEventListener` before removing DOM nodes.',
    },
  ],

  // ─── JAVA ────────────────────────────────────────────────────
  java: [
    {
      id: 'java-1',
      type: 'Code Output',
      topic: 'Strings & Immutability',
      difficulty: 'Beginner',
      question: 'What is the output of the following Java snippet?',
      code: `String s1 = "Hello";\nString s2 = "Hello";\nString s3 = new String("Hello");\nSystem.out.println((s1 == s2) + " " + (s1 == s3));`,
      options: ['true true', 'true false', 'false false', 'false true'],
      correctAnswer: 1,
      explanation: '`s1` and `s2` reference the same String literal pool instance (`==` returns true). `s3` is explicitly allocated on the heap, so `s1 == s3` checks reference equality and returns false.',
    },
    {
      id: 'java-2',
      type: 'Debugging',
      topic: 'Collections & Concurrency',
      difficulty: 'Intermediate',
      question: 'Which exception is thrown when modifying an ArrayList during iteration without an explicit Iterator.remove()?',
      code: `List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));\nfor (String item : list) {\n    if (item.equals("B")) list.remove(item);\n}`,
      options: ['NullPointerException', 'IndexOutOfBoundsException', 'ConcurrentModificationException', 'IllegalStateException'],
      correctAnswer: 2,
      explanation: 'Enhanced for-loops use an implicit Iterator. Modifying the underlying collection directly modifies the modCount and causes a ConcurrentModificationException.',
    },
    {
      id: 'java-3',
      type: 'Conceptual',
      topic: 'JVM Memory Model',
      difficulty: 'Advanced',
      question: 'Where are Java object instances and static class metadata stored in JVM 8+?',
      code: null,
      options: [
        'Objects in Heap; static metadata in PermGen space.',
        'Objects in Heap; static metadata in Metaspace (native memory).',
        'Objects in Stack; static metadata in JVM Register.',
        'Both objects and metadata in thread-local Stack memory.',
      ],
      correctAnswer: 1,
      explanation: 'In Java 8, PermGen was replaced with Metaspace, which resides in native memory, while all object instances reside in the Heap.',
    },
    {
      id: 'java-4',
      type: 'Conceptual',
      topic: 'OOP & Interfaces',
      difficulty: 'Beginner',
      question: 'What is a key difference between an `abstract class` and an `interface` in Java 8+?',
      code: null,
      options: [
        'Abstract classes cannot have any implemented methods.',
        'A class can extend multiple abstract classes, but implement only one interface.',
        'An abstract class can have constructors and instance state; a class can implement multiple interfaces but extend only one abstract class.',
        'Interfaces cannot define any methods in Java 8+.',
      ],
      correctAnswer: 2,
      explanation: 'Abstract classes support constructors and instance fields, allowing shared state. Java supports multiple interface implementation but only single-class inheritance. Java 8+ interfaces can have `default` and `static` methods.',
    },
    {
      id: 'java-5',
      type: 'Code Output',
      topic: 'Generics & Type Erasure',
      difficulty: 'Advanced',
      question: 'What is "Type Erasure" in Java Generics, and what is its primary implication?',
      code: null,
      options: [
        'Generic type parameters are removed at runtime by the JVM; you cannot perform `instanceof` checks against generic type parameters.',
        'Generics prevent casting exceptions at compile time and are fully retained at runtime.',
        'Type Erasure only applies to primitive types like `int` and `double`.',
        'Type Erasure converts all generics to `Object[]` arrays at runtime.',
      ],
      correctAnswer: 0,
      explanation: 'Java erases generic type information during compilation and replaces it with raw types or bounds. At runtime, `List<String>` and `List<Integer>` are both just `List`. This means you cannot use `instanceof List<String>` or create generic arrays.',
    },
    {
      id: 'java-6',
      type: 'Practical',
      topic: 'Java Streams & Lambdas',
      difficulty: 'Intermediate',
      question: 'What does the following Java Streams pipeline return?',
      code: `List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);\nint result = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .mapToInt(n -> n * n)\n    .sum();\nSystem.out.println(result);`,
      options: ['20', '25', '9', '4'],
      correctAnswer: 0,
      explanation: '`filter(n -> n % 2 == 0)` keeps [2, 4]. `mapToInt(n -> n * n)` squares them to [4, 16]. `.sum()` returns 4 + 16 = 20.',
    },
    {
      id: 'java-7',
      type: 'Architecture',
      topic: 'Multithreading & Synchronization',
      difficulty: 'Advanced',
      question: 'What is the difference between `synchronized` methods and `ReentrantLock` in Java concurrency?',
      code: null,
      options: [
        'They are functionally identical; `ReentrantLock` is just syntactic sugar for `synchronized`.',
        '`ReentrantLock` offers additional capabilities: try-lock with timeout, interruptible lock acquisition, fairness policies, and multiple Condition variables — giving finer-grained control than `synchronized`.',
        '`synchronized` can only lock on static methods, while `ReentrantLock` works on instance methods.',
        '`ReentrantLock` is deprecated in Java 11+ and should not be used.',
      ],
      correctAnswer: 1,
      explanation: '`synchronized` is simple and automatic but has limitations. `ReentrantLock` supports `tryLock()`, `lockInterruptibly()`, fairness ordering (prevents starvation), and multiple condition variables for complex producer-consumer scenarios.',
    },
  ],

  // ─── C / C++ ─────────────────────────────────────────────────
  cpp: [
    {
      id: 'cpp-1',
      type: 'Code Output',
      topic: 'Pointers & Arithmetic',
      difficulty: 'Intermediate',
      question: 'What is the output of this C++ program?',
      code: `#include <iostream>\nint main() {\n    int arr[] = {10, 20, 30, 40};\n    int* ptr = arr;\n    ptr++;\n    std::cout << *ptr << " " << *(ptr + 2);\n    return 0;\n}`,
      options: ['10 30', '20 40', '20 30', '10 20'],
      correctAnswer: 1,
      explanation: '`ptr++` advances the pointer to point to `arr[1]` (20). `*(ptr + 2)` then accesses the element 2 positions further (`arr[3]`, which is 40).',
    },
    {
      id: 'cpp-2',
      type: 'Debugging',
      topic: 'Dynamic Memory & Destructors',
      difficulty: 'Advanced',
      question: 'Why should a base class destructor always be declared virtual in C++?',
      code: `class Base { public: ~Base() { /* cleanup */ } };\nclass Derived : public Base { private: int* data; public: ~Derived() { delete[] data; } };\nBase* b = new Derived();\ndelete b;`,
      options: [
        'To enable abstract method overrides in the derived class.',
        'To ensure the derived class destructor is invoked when deleting via a base pointer, preventing memory leaks.',
        'To automatically allocate the object on stack memory.',
        'Virtual destructors are required for all classes with public methods.',
      ],
      correctAnswer: 1,
      explanation: 'Deleting a derived class object through a pointer to Base when Base has a non-virtual destructor results in undefined behavior and skips the Derived destructor, causing leaks.',
    },
    {
      id: 'cpp-3',
      type: 'Performance & STL',
      topic: 'std::vector capacity & reallocation',
      difficulty: 'Intermediate',
      question: 'What happens to iterators and pointers to elements of a `std::vector` when a `push_back()` triggers a capacity reallocation?',
      code: null,
      options: [
        'They remain valid because memory is contiguous.',
        'All existing iterators, pointers, and references to elements are invalidated.',
        'Only the `end()` iterator is invalidated.',
        'The program throws a `std::bad_alloc` compilation warning.',
      ],
      correctAnswer: 1,
      explanation: 'When a vector expands beyond its capacity, it allocates a new larger buffer, moves existing elements, and frees the old buffer, invalidating all pointers, references, and iterators.',
    },
    {
      id: 'cpp-4',
      type: 'Conceptual',
      topic: 'RAII & Smart Pointers',
      difficulty: 'Intermediate',
      question: 'What does RAII (Resource Acquisition Is Initialization) mean in C++, and which modern feature implements it for heap memory?',
      code: null,
      options: [
        'Resources are allocated globally at program startup and freed at exit; implemented via `malloc`.',
        'Resources are tied to object lifetime — acquired in the constructor and released in the destructor; `std::unique_ptr` and `std::shared_ptr` implement this for heap memory.',
        'RAII forces all memory onto the stack, avoiding heap allocation entirely.',
        'RAII is a C++20 concept that replaces virtual destructors.',
      ],
      correctAnswer: 1,
      explanation: 'RAII binds resource management to object scope. Smart pointers (`unique_ptr`, `shared_ptr`) automatically call `delete` in their destructor, preventing leaks even when exceptions are thrown.',
    },
    {
      id: 'cpp-5',
      type: 'Code Output',
      topic: 'Move Semantics',
      difficulty: 'Advanced',
      question: 'What is the primary purpose of move semantics (`std::move`) introduced in C++11?',
      code: null,
      options: [
        'To copy objects more slowly to prevent data corruption.',
        'To transfer ownership of resources from a temporary (rvalue) to another object without expensive deep copies, leaving the source in a valid but unspecified state.',
        'To move objects between threads safely.',
        '`std::move` is equivalent to `std::swap` and physically relocates memory addresses.',
      ],
      correctAnswer: 1,
      explanation: '`std::move` casts an lvalue to an rvalue reference, enabling the move constructor/assignment to steal the underlying resource (e.g., heap buffer) instead of copying it — a critical optimization for containers like `std::vector` and `std::string`.',
    },
    {
      id: 'cpp-6',
      type: 'Debugging',
      topic: 'Undefined Behavior',
      difficulty: 'Advanced',
      question: 'What is the bug in the following code, and what is its consequence?',
      code: `int* createArray() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    return arr;\n}\nint main() {\n    int* p = createArray();\n    std::cout << p[0];\n}`,
      options: [
        'Correct — stack arrays can be safely returned by pointer.',
        'Undefined Behavior — `arr` is a local stack variable; its memory is freed when `createArray()` returns, so `p` is a dangling pointer.',
        'Compile error — you cannot return arrays from functions.',
        'The function returns the address of a static variable, which is valid.',
      ],
      correctAnswer: 1,
      explanation: 'Local variables are allocated on the stack and destroyed when the function returns. Returning a pointer to a local array creates a dangling pointer — accessing it is undefined behavior and may crash or produce garbage.',
    },
    {
      id: 'cpp-7',
      type: 'Architecture',
      topic: 'Templates & Generic Programming',
      difficulty: 'Advanced',
      question: 'What is the key advantage of C++ templates over runtime polymorphism (virtual functions)?',
      code: null,
      options: [
        'Templates allow code to run on both 32-bit and 64-bit systems.',
        'Templates generate type-specific code at compile time (zero overhead abstraction), avoiding virtual dispatch costs (vtable lookup and pointer indirection) at runtime.',
        'Templates are checked at runtime, providing better error messages than virtual functions.',
        'Virtual functions eliminate all runtime overhead unlike templates.',
      ],
      correctAnswer: 1,
      explanation: 'C++ templates (static polymorphism) are resolved at compile time, generating specialized machine code with no runtime dispatch cost. Virtual functions require a vtable pointer lookup per call — a small but measurable overhead in high-performance code.',
    },
  ],
}

// ─── CODECHEF & HACKERRANK COMPETITIVE CODING QUESTION BANK ──────────────────
export const CODECHEF_QUESTION_BANK = {
  python: [
    {
      id: 'cc-py-1',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'CHEF-SUBARR',
      starRating: '★★ 2-Star (1540 Rating)',
      contest: 'CodeChef Starters Div 2',
      topic: 'Prefix Sums & HashMaps',
      difficulty: 'Intermediate',
      title: 'Chef and Continuous Subarrays',
      question: 'Chef has an array of N integers. Help Chef find the total number of continuous non-empty subarrays whose sum equals K.',
      problemStatement: `Chef is organizing a food festival with N customer orders arranged in a queue, represented by an array \`nums\`. Each order has an associated satisfaction score (which can be positive, zero, or negative).

Chef needs to find the total number of continuous segments of orders whose total combined satisfaction score equals exactly \`K\`.

A subarray is defined as a contiguous non-empty sequence of elements within the array.`,
      inputFormat: `• First line contains two space-separated integers N and K.
• Second line contains N space-separated integers representing array nums.`,
      outputFormat: `Print a single integer: the count of continuous subarrays with sum equal to K.`,
      constraints: `1 <= N <= 2 * 10^4
-1000 <= nums[i] <= 1000
-10^7 <= K <= 10^7
Time Limit: 1.0s, Memory Limit: 256 MB`,
      subtasks: `Subtask 1 (30 pts): N <= 500 (O(N^2) accepted)
Subtask 2 (70 pts): Original constraints (O(N) expected)`,
      sampleTestCases: [
        {
          input: 'nums = [1, 1, 1], k = 2',
          output: '2',
          explanation: 'Subarrays [1, 1] starting at index 0 and index 1 both sum to 2.',
        },
        {
          input: 'nums = [1, 2, 3], k = 3',
          output: '2',
          explanation: 'Subarrays [1, 2] and [3] both sum to 3.',
        },
      ],
      hiddenTestCases: [
        { input: 'nums = [3, 4, 7, 2, -3, 1, 4, 2], k = 7', output: '4' },
        { input: 'nums = [0, 0, 0, 0], k = 0', output: '10' },
        { input: 'nums = [1, -1, 1, -1, 1], k = 0', output: '4' },
      ],
      starterCode: `# CodeChef Challenge: Chef and Continuous Subarrays
# Language: Python 3

def subarraySum(nums, k):
    # Write your optimal O(N) solution using prefix sums & dict
    count = 0
    curr_sum = 0
    prefix_map = {0: 1}

    for num in nums:
        curr_sum += num
        if curr_sum - k in prefix_map:
            count += prefix_map[curr_sum - k]
        prefix_map[curr_sum] = prefix_map.get(curr_sum, 0) + 1

    return count

# Sample Test Execution
print(subarraySum([1, 1, 1], 2))
`,
      expectedOutput: '2',
      explanation: 'Using prefix sums stored in a dictionary allows us to count valid subarrays in O(N) linear time and O(N) space.',
    },
    {
      id: 'cc-py-2',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'CHEF-2SUM',
      starRating: '★ 1-Star (1280 Rating)',
      contest: 'CodeChef Practice Arena',
      topic: 'Two Pointers & HashTables',
      difficulty: 'Beginner',
      title: 'Chef and Two Sum Challenge',
      question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      problemStatement: `Chef wants to pair up ingredients from the pantry. He has an array of integer values \`nums\` and an exact target sum \`target\`.

Find two distinct indices in the array such that their values add up to \`target\`. You may assume each input has exactly one solution, and you may not use the same element twice.`,
      inputFormat: `• First line contains target integer.
• Second line contains N integers of array nums.`,
      outputFormat: `Return a 2-element list [index1, index2] representing 0-based indices.`,
      constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9`,
      subtasks: `Subtask 1 (100 pts): Optimal O(N) single-pass hash map`,
      sampleTestCases: [
        {
          input: 'nums = [2, 7, 11, 15], target = 9',
          output: '[0, 1]',
          explanation: 'nums[0] + nums[1] == 2 + 7 == 9, so return [0, 1].',
        },
      ],
      hiddenTestCases: [
        { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
        { input: 'nums = [3, 3], target = 6', output: '[0, 1]' },
      ],
      starterCode: `# CodeChef Challenge: Chef and Two Sum
# Language: Python 3

def twoSum(nums, target):
    # Store visited value -> index
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

print(twoSum([2, 7, 11, 15], 9))
`,
      expectedOutput: '[0, 1]',
      explanation: 'One-pass hash map records seen elements and finds complement in O(1) time per item, achieving total O(N) runtime.',
    },
    {
      id: 'cc-py-3',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'CHEF-PALIN',
      starRating: '★★ 2-Star (1620 Rating)',
      contest: 'CodeChef Lunchtime Div 1',
      topic: 'Dynamic Programming & Strings',
      difficulty: 'Advanced',
      title: 'Chef and Longest Palindromic Substring',
      question: 'Given a string s, return the longest palindromic substring in s.',
      problemStatement: `Chef has received an encrypted recipe string \`s\`. A hidden magic key inside the string corresponds to the longest contiguous substring that reads the same forwards and backwards.

Help Chef extract this longest palindromic substring efficiently.`,
      inputFormat: `Single string s containing lowercase English letters.`,
      outputFormat: `Print the longest palindromic substring. If multiple exist, return any valid one.`,
      constraints: `1 <= s.length <= 1000
s consists of only lowercase English letters.`,
      subtasks: `Subtask 1 (40 pts): s.length <= 50
Subtask 2 (60 pts): Original constraints`,
      sampleTestCases: [
        {
          input: 's = "babad"',
          output: 'bab',
          explanation: '"aba" is also a valid answer.',
        },
      ],
      hiddenTestCases: [
        { input: 's = "cbbd"', output: 'bb' },
        { input: 's = "racecar"', output: 'racecar' },
      ],
      starterCode: `# CodeChef Challenge: Longest Palindromic Substring
# Language: Python 3

def longestPalindrome(s: str) -> str:
    if not s:
        return ""

    start = 0
    max_len = 1

    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return left + 1, right - left - 1

    for i in range(len(s)):
        # Odd length palindrome
        l1, len1 = expand(i, i)
        # Even length palindrome
        l2, len2 = expand(i, i + 1)

        if len1 > max_len:
            start, max_len = l1, len1
        if len2 > max_len:
            start, max_len = l2, len2

    return s[start:start + max_len]

print(longestPalindrome("babad"))
`,
      expectedOutput: 'bab',
      explanation: 'Expand-around-center checks 2n-1 center points in O(N^2) time with O(1) additional memory.',
    },
  ],

  javascript: [
    {
      id: 'cc-js-1',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'JS-CHUNK-01',
      starRating: '★ 1-Star (1300 Rating)',
      contest: 'CodeChef Web Arena',
      topic: 'Arrays & Slicing',
      difficulty: 'Beginner',
      title: 'Chef and Array Chunking',
      question: 'Given an array arr and a chunk size size, return a chunked array of subarrays each with maximum length size.',
      problemStatement: `Chef needs to pack meal boxes into batches. Given an array \`arr\` and a chunk size \`size\`, return a chunked array.

A chunked array contains the original elements in \`arr\`, but consists of subarrays each of length \`size\`. The length of the last subarray may be less than \`size\` if \`arr.length\` is not divisible by \`size\`.`,
      inputFormat: `• arr: Array of items
• size: integer batch size`,
      outputFormat: `Return 2D array of chunked subarrays.`,
      constraints: `1 <= arr.length <= 10^4
1 <= size <= arr.length`,
      subtasks: `Subtask 1 (100 pts): Clean functional or iterative O(N) solution`,
      sampleTestCases: [
        {
          input: 'arr = [1, 2, 3, 4, 5], size = 2',
          output: '[[1, 2], [3, 4], [5]]',
          explanation: 'The array has been split into subarrays of size 2, with the remainder in the final subarray.',
        },
      ],
      hiddenTestCases: [
        { input: 'arr = [1, 9, 6, 3, 2], size = 3', output: '[[1, 9, 6], [3, 2]]' },
        { input: 'arr = [8, 5, 3, 2, 6], size = 6', output: '[[8, 5, 3, 2, 6]]' },
      ],
      starterCode: `// CodeChef Challenge: Array Chunking
// Language: JavaScript (Node.js)

function chunk(arr, size) {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
        chunked.push(arr.slice(i, i + size));
    }
    return chunked;
}

console.log(JSON.stringify(chunk([1, 2, 3, 4, 5], 2)));
`,
      expectedOutput: '[[1,2],[3,4],[5]]',
      explanation: 'Iterating with step `size` and taking slices creates the chunked batches in linear O(N) time.',
    },
    {
      id: 'cc-js-2',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'JS-MEMO-02',
      starRating: '★★ 2-Star (1590 Rating)',
      contest: 'CodeChef Front-End Arena',
      topic: 'Closures & Higher-Order Functions',
      difficulty: 'Intermediate',
      title: 'Chef and High-Speed Memoizer',
      question: 'Given a function fn, return a memoized version of that function that caches results based on arguments.',
      problemStatement: `Chef calculates expensive recipe pricing models. Write a function \`memoize(fn)\` that returns a cached version of \`fn\`.

A memoized function will never be called twice with the same inputs; instead it will return a cached value from memory.`,
      inputFormat: `Any function fn accepting arguments.`,
      outputFormat: `Returns memoized function instance.`,
      constraints: `0 <= arguments.length <= 10
arguments are JSON serializable`,
      subtasks: `Subtask 1 (100 pts): O(1) cache lookup using closure Map`,
      sampleTestCases: [
        {
          input: 'fn = (a, b) => a + b; memoized(2, 3); memoized(2, 3);',
          output: '5',
          explanation: 'First call evaluates 2+3=5. Second call returns cached 5 immediately.',
        },
      ],
      hiddenTestCases: [
        { input: 'factorial(5)', output: '120' },
        { input: 'fib(6)', output: '8' },
      ],
      starterCode: `// CodeChef Challenge: High-Speed Memoize
// Language: JavaScript (Node.js)

function memoize(fn) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

const sum = (a, b) => a + b;
const memoizedSum = memoize(sum);
console.log(memoizedSum(2, 3));
console.log(memoizedSum(2, 3)); // Cache hit
`,
      expectedOutput: '5',
      explanation: 'Using a Map closure to index serialized argument keys guarantees O(1) amortized cache lookup.',
    },
  ],

  react: [
    {
      id: 'cc-react-1',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'REACT-DEBOUNCE',
      starRating: '★★ 2-Star (1500 Rating)',
      contest: 'CodeChef React Arena',
      topic: 'Custom Hooks & Timers',
      difficulty: 'Intermediate',
      title: 'Chef and useDebounce Hook',
      question: 'Implement a custom useDebounce hook that delays updating value until delay milliseconds have elapsed.',
      problemStatement: `Chef has a live ingredient search bar. If the query updates on every keystroke, the server gets overwhelmed.

Create a custom React hook \`useDebounce(value, delay)\` that returns the debounced value, resetting its timer whenever \`value\` changes.`,
      inputFormat: `• value: any state variable
• delay: number (milliseconds)`,
      outputFormat: `Returns debounced value synchronized after delay.`,
      constraints: `delay >= 0
Supports primitive and object types.`,
      subtasks: `Subtask 1 (100 pts): Proper useEffect cleanup with clearTimeout`,
      sampleTestCases: [
        {
          input: 'useDebounce("pizza", 500)',
          output: '"pizza"',
          explanation: 'Returns value after 500ms delay without memory leaks.',
        },
      ],
      hiddenTestCases: [],
      starterCode: `import { useState, useEffect } from 'react';

// CodeChef React Challenge: useDebounce
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Teardown previous timer on fast updates
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Test validation
console.log("Hook structure validated");
`,
      expectedOutput: 'Hook structure validated',
      explanation: 'Clearing the previous timeout inside the useEffect cleanup function prevents race conditions and stale executions.',
    },
  ],

  cpp: [
    {
      id: 'cc-cpp-1',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'CPP-BIN-SEARCH',
      starRating: '★ 1-Star (1350 Rating)',
      contest: 'CodeChef DSA Contest',
      topic: 'Binary Search & Vectors',
      difficulty: 'Beginner',
      title: 'Chef and Binary Search Index',
      question: 'Given a sorted array of distinct integers and a target value, return the index if target is found in O(log N).',
      problemStatement: `Chef has a sorted ledger of order IDs in ascending order. Given a target order ID \`target\`, return its 0-based index. If not found, return -1.

Your algorithm must run in strictly O(log N) runtime complexity.`,
      inputFormat: `• nums: Sorted array of distinct integers
• target: Integer to find`,
      outputFormat: `Print 0-based index or -1 if not found.`,
      constraints: `1 <= nums.length <= 10^5
-10^4 <= nums[i], target <= 10^4`,
      subtasks: `Subtask 1 (100 pts): O(log N) binary search`,
      sampleTestCases: [
        {
          input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
          output: '4',
          explanation: '9 exists in nums and its index is 4.',
        },
      ],
      hiddenTestCases: [
        { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' },
        { input: 'nums = [5], target = 5', output: '0' },
      ],
      starterCode: `// CodeChef Challenge: Binary Search
// Language: C++17

#include <iostream>
#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << search(nums, 9) << endl;
    return 0;
}
`,
      expectedOutput: '4',
      explanation: 'Binary search halves the search space every iteration, achieving O(log N) time and O(1) space.',
    },
  ],

  java: [
    {
      id: 'cc-java-1',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'JAVA-ANAGRAM',
      starRating: '★ 1-Star (1290 Rating)',
      contest: 'CodeChef Starters Div 3',
      topic: 'Strings & HashTables',
      difficulty: 'Beginner',
      title: 'Chef and Anagram Strings',
      question: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
      problemStatement: `Chef is testing if two order recipes \`s\` and \`t\` contain identical letters in different permutations.

An anagram is a word formed by rearranging the letters of a different word, typically using all the original letters exactly once.`,
      inputFormat: `Two strings s and t on separate lines.`,
      outputFormat: `Print "true" or "false".`,
      constraints: `1 <= s.length, t.length <= 5 * 10^4
s and t consist of lowercase English letters.`,
      subtasks: `Subtask 1 (100 pts): O(N) frequency array`,
      sampleTestCases: [
        {
          input: 's = "anagram", t = "nagaram"',
          output: 'true',
          explanation: 'All characters match with identical frequencies.',
        },
      ],
      hiddenTestCases: [
        { input: 's = "rat", t = "car"', output: 'false' },
      ],
      starterCode: `// CodeChef Challenge: Valid Anagram
// Language: Java 17

import java.util.*;

public class Solution {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }

        for (int c : counts) {
            if (c != 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram"));
    }
}
`,
      expectedOutput: 'true',
      explanation: 'A 26-element array counting characters achieves O(N) linear time and O(1) auxiliary space.',
    },
  ],

  sql: [
    {
      id: 'cc-sql-1',
      isCoding: true,
      type: 'CodeChef Challenge',
      codechefCode: 'SQL-SECOND-SALARY',
      starRating: '★★ 2-Star (1480 Rating)',
      contest: 'CodeChef Database Arena',
      topic: 'Subqueries & DENSE_RANK',
      difficulty: 'Intermediate',
      title: 'Chef and Second Highest Salary',
      question: 'Write a SQL query to find the second highest distinct salary from the Employee table.',
      problemStatement: `Chef's restaurant payroll table \`Employee\` tracks employee IDs and salaries.

Write an SQL query to report the second highest distinct salary from the Employee table. If there is no second highest salary, the query should report \`null\` / \`None\`.`,
      inputFormat: `Table Employee (id INT, salary INT)`,
      outputFormat: `Single column SecondHighestSalary`,
      constraints: `id is primary key
salaries are positive integers`,
      subtasks: `Subtask 1 (100 pts): Handles duplicates & nulls correctly`,
      sampleTestCases: [
        {
          input: 'Employee: [(1, 100), (2, 200), (3, 300)]',
          output: '200',
          explanation: '300 is highest, 200 is second highest.',
        },
      ],
      hiddenTestCases: [
        { input: 'Employee: [(1, 100)]', output: 'null' },
      ],
      starterCode: `-- CodeChef Challenge: Second Highest Salary
-- Language: SQL (PostgreSQL / MySQL)

SELECT (
    SELECT DISTINCT salary 
    FROM Employee 
    ORDER BY salary DESC 
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
`,
      expectedOutput: '200',
      explanation: 'Using LIMIT 1 OFFSET 1 wrapped in a scalar subquery cleanly returns NULL if fewer than 2 distinct salaries exist.',
    },
  ],
}

/**
 * Generate a practice test session based on user selections
 */
export async function generatePracticeTest({
  technology = 'python',
  difficulty = 'Intermediate',
  questionCount = 5,
  durationMinutes = 10,
  mode = 'codechef',
}) {
  await new Promise((r) => setTimeout(r, 350))

  const techKey = technology.toLowerCase().replace(/[^a-z-]/g, '')
  const codechefBank = CODECHEF_QUESTION_BANK[techKey] || CODECHEF_QUESTION_BANK.python
  const standardBank = QUESTION_BANK[techKey] || QUESTION_BANK.python

  let selectedQuestions = []

  if (mode === 'codechef') {
    // In CodeChef mode, prioritize coding challenges
    selectedQuestions = [...codechefBank]
    // If user requested more questions than coding challenges available, supplement with standard bank
    if (selectedQuestions.length < questionCount) {
      const remaining = questionCount - selectedQuestions.length
      const shuffledStd = [...standardBank].sort(() => 0.5 - Math.random())
      selectedQuestions = [...selectedQuestions, ...shuffledStd.slice(0, remaining)]
    } else {
      selectedQuestions = selectedQuestions.slice(0, questionCount)
    }
  } else {
    // In standard mode, take from standard bank
    const shuffled = [...standardBank].sort(() => 0.5 - Math.random())
    selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length))
  }

  // If still below desired count, repeat variations
  while (selectedQuestions.length < questionCount) {
    const fallbackBank = mode === 'codechef' ? codechefBank : standardBank
    const copy = { ...fallbackBank[selectedQuestions.length % fallbackBank.length] }
    copy.id = `${copy.id}-repeat-${selectedQuestions.length}`
    selectedQuestions.push(copy)
  }

  return {
    testId: `test-${Date.now()}`,
    technology,
    difficulty,
    mode,
    questionCount: selectedQuestions.length,
    durationMinutes,
    durationSeconds: durationMinutes * 60,
    questions: selectedQuestions,
  }
}

/**
 * Map questions to competency dimensions deterministically
 */
function getQuestionDimensions(q) {
  const dims = []
  const type = q.type || ''
  const topic = (q.topic || '').toLowerCase()

  if (
    ['Conceptual', 'Multiple Choice', 'True/False'].includes(type) ||
    topic.includes('concept') ||
    topic.includes('model') ||
    topic.includes('closure') ||
    topic.includes('lifecycle') ||
    topic.includes('mutability')
  ) {
    dims.push('conceptUnderstanding')
  }

  if (
    ['Practical', 'Architecture'].includes(type) ||
    topic.includes('vpc') ||
    topic.includes('volume') ||
    topic.includes('service') ||
    topic.includes('hybrid') ||
    topic.includes('join') ||
    topic.includes('pipeline')
  ) {
    dims.push('practicalApplication')
  }

  if (
    ['Debugging', 'Scenario Based'].includes(type) ||
    topic.includes('error') ||
    topic.includes('bug') ||
    topic.includes('optimization') ||
    topic.includes('exception') ||
    topic.includes('tradeoff')
  ) {
    dims.push('problemSolving')
  }

  if (
    ['Code Output', 'Debugging'].includes(type) ||
    q.code ||
    topic.includes('output') ||
    topic.includes('scope') ||
    topic.includes('syntax')
  ) {
    dims.push('codeQuality')
  }

  if (
    ['Architecture', 'Scenario Based', 'Practical'].includes(type) ||
    topic.includes('best') ||
    topic.includes('security') ||
    topic.includes('cache') ||
    topic.includes('isolation') ||
    topic.includes('lock') ||
    topic.includes('index') ||
    topic.includes('immutability')
  ) {
    dims.push('bestPractices')
  }

  if (dims.length === 0) {
    dims.push('conceptUnderstanding', 'practicalApplication')
  }
  return dims
}

/**
 * Domain-specific recommendations
 */
const TECH_RECOMMENDATIONS = {
  react: {
    learning: [
      'Advanced React Hooks (useCallback, useMemo, useId, custom hooks)',
      'Component Lifecycle & Re-render optimization with React Profiler',
      'Context API performance splitting & Zustand state management',
      'React Server Components & Next.js App Router mechanics',
    ],
    practice: [
      'Build an abortable search filter hook using AbortController and debouncing',
      'Refactor a deeply nested state tree using split Context providers',
      'Implement an infinite virtualized feed handling dynamic card heights',
      'Take another intermediate React test to validate progress',
    ],
    nextSteps: [
      'Learn advanced React Hooks',
      'Practice API integration',
      'Review state management',
      'Take another intermediate test',
    ],
  },
  python: {
    learning: [
      'Python Memory Model, Object References & Mutable Default Traps',
      'CPython GIL, AsyncIO event loop vs Multiprocessing',
      'Dunder methods (__iter__, __enter__, __call__) & Metaprogramming',
      'Advanced Error Handling & Custom Exception Hierarchies',
    ],
    practice: [
      'Write a context manager for managed thread-safe connection pooling',
      'Benchmark synchronous vs AsyncIO vs ProcessPool for I/O and CPU workloads',
      'Implement an LRU cache decorator using OrderedDict from scratch',
      'Take another intermediate Python test',
    ],
    nextSteps: [
      'Study CPython memory allocation & references',
      'Practice writing AsyncIO concurrent workers',
      'Review custom exception handling hierarchies',
      'Take another intermediate test',
    ],
  },
  sql: {
    learning: [
      'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD/LAG)',
      'Query Execution Plans, Table Scans & B-Tree Index Mechanics',
      'Complex CTEs (Common Table Expressions) & Recursive Queries',
      'ACID Transaction Isolation Levels & Deadlock Avoidance',
    ],
    practice: [
      'Write a multi-level rollup revenue calculation using Window Functions',
      'Optimize a slow query with composite indexes based on EXPLAIN ANALYZE',
      'Design a normalized relational schema with strict referential integrity',
      'Take another SQL assessment',
    ],
    nextSteps: [
      'Master SQL Window Functions & CTEs',
      'Analyze query execution plans and indexing strategies',
      'Practice complex multi-table aggregations',
      'Take another intermediate test',
    ],
  },
  aws: {
    learning: [
      'VPC Subnets, Route Tables, NAT Gateways & Bastion Hosts',
      'IAM Roles, Session Policies & Least Privilege Condition Keys',
      'Serverless Architecture with AWS Lambda, API Gateway & DynamoDB',
      'S3 Lifecycle Transitions & Cross-Region Disaster Recovery',
    ],
    practice: [
      'Architect a resilient 3-tier VPC with public and private subnets',
      'Create an IAM policy restricting bucket actions by IP and tag conditions',
      'Deploy an event-driven serverless workflow using Lambda and SQS',
      'Take another AWS assessment',
    ],
    nextSteps: [
      'Study VPC networking and route tables',
      'Practice IAM policy authoring and condition keys',
      'Review AWS Lambda concurrency limits',
      'Take another intermediate test',
    ],
  },
  docker: {
    learning: [
      'Multi-Stage Dockerfiles & BuildKit Layer Cache Optimization',
      'Docker Compose Networking, Volumes & Secret Management',
      'Linux Kernel Namespaces, cgroups & Container Security Profiles',
      'Healthchecks, Restart Policies & Graceful Signal Handling (SIGTERM)',
    ],
    practice: [
      'Write a 2-stage production Dockerfile minimizing image size below 100MB',
      'Configure a multi-service Docker Compose with isolated network bridges',
      'Mount persistent named volumes and test container teardown data persistence',
      'Take another Docker assessment',
    ],
    nextSteps: [
      'Optimize Docker multi-stage build layers',
      'Practice container networking and volume mounts',
      'Study container runtime isolation security',
      'Take another intermediate test',
    ],
  },
  'machine-learning': {
    learning: [
      'Bias-Variance Tradeoff, L1/L2 Regularization & Early Stopping',
      'Evaluation Metrics for Imbalanced Data (F1-score, PR-AUC, ROC-AUC)',
      'Cross-Validation Strategies & Preventing Data Leakage',
      'Feature Scaling, One-Hot vs Target Encoding & Pipelines',
    ],
    practice: [
      'Build a scikit-learn Pipeline with custom transformers and cross-validation',
      'Tune hyperparameters using Bayesian Optimization / Optuna',
      'Diagnose learning curves to identify high bias vs high variance',
      'Take another Machine Learning assessment',
    ],
    nextSteps: [
      'Review regularized loss functions and cost curves',
      'Practice cross-validation without data leakage',
      'Study evaluation metrics for imbalanced datasets',
      'Take another intermediate test',
    ],
  },
  rag: {
    learning: [
      'Dense Vector Embeddings & Vector Similarity Metrics (Cosine, Inner Product)',
      'Hybrid Search combining BM25 Keyword Search with Dense Embeddings',
      'Cross-Encoder Rerankers for Precision Top-K Context Selection',
      'Context Window Attention Drift & Hallucination Mitigation Patterns',
    ],
    practice: [
      'Implement chunking with semantic overlap and metadata enrichment',
      'Set up a two-stage retrieval pipeline with bi-encoder and reranker',
      'Evaluate retrieval recall@k against an enterprise ground truth benchmark',
      'Take another RAG assessment',
    ],
    nextSteps: [
      'Study Vector Indexing and Hierarchical Navigable Small World (HNSW)',
      'Practice hybrid retrieval implementation',
      'Review reranking and context compression techniques',
      'Take another intermediate test',
    ],
  },
  javascript: {
    learning: [
      'JavaScript Event Loop, Microtasks (Promises) vs Macrotasks (Timers)',
      'Lexical Closures, Scope Chains & Garbage Collection Traps',
      'Prototypes, Prototype Chains & Class Inheritance Internals',
      'Asynchronous Programming (Promise.allSettled, async/await error boundaries)',
    ],
    practice: [
      'Implement Promise.all and Promise.allSettled from scratch',
      'Create a debounce utility with immediate execution and cancel methods',
      'Build a custom EventEmitter supporting once and off handlers',
      'Take another JavaScript assessment',
    ],
    nextSteps: [
      'Master Event Loop task queue scheduling',
      'Practice lexical closures and memory leak prevention',
      'Review prototype chain inheritance',
      'Take another intermediate test',
    ],
  },
  java: {
    learning: [
      'JVM Memory Model: Heap, Stack, Metaspace & Garbage Collection Algorithms',
      'Java Concurrency: ReentrantLock, Executors, CompletableFuture & Virtual Threads',
      'Java Streams API, Lambdas & Functional Interfaces (Predicate, Function, Supplier)',
      'Design Patterns in Java: Builder, Factory, Observer & Dependency Injection',
    ],
    practice: [
      'Implement a thread-safe LRU Cache using ConcurrentHashMap and LinkedHashMap',
      'Build a custom generic Stack/Queue with Iterator support',
      'Write a CompletableFuture pipeline for concurrent API data aggregation',
      'Take another Java assessment',
    ],
    nextSteps: [
      'Study JVM garbage collection tuning (G1, ZGC)',
      'Practice Java concurrency with ExecutorService and locks',
      'Review Java Streams and Optional handling',
      'Take another intermediate test',
    ],
  },
  cpp: {
    learning: [
      'RAII, Smart Pointers (unique_ptr, shared_ptr, weak_ptr) & Ownership Semantics',
      'Move Semantics, Rvalue References & Perfect Forwarding',
      'Template Metaprogramming, Concepts (C++20) & SFINAE',
      'STL Containers Internals, Allocators & Cache-Efficient Data Structures',
    ],
    practice: [
      'Implement a type-safe `std::variant`-based state machine',
      'Write a custom allocator for a memory pool using placement new',
      'Build a generic thread pool using `std::thread` and condition variables',
      'Take another C/C++ assessment',
    ],
    nextSteps: [
      'Master RAII patterns and smart pointer ownership rules',
      'Practice move semantics and copy/move constructor implementation',
      'Review template specialization and C++20 Concepts',
      'Take another advanced test',
    ],
  },
}

/**
 * Grade test and return detailed breakdown calculated from actual answers
 * Zero random numbers are used.
 */
export async function submitPracticeTest({
  testId,
  questions,
  answers,
  timeSpentSeconds,
  technology = 'React',
  difficulty = 'Intermediate',
}) {
  await new Promise((r) => setTimeout(r, 400))

  let correctCount = 0
  const review = questions.map((q, idx) => {
    const selected = answers[idx]
    const isCorrect = selected === q.correctAnswer
    if (isCorrect) correctCount++

    return {
      questionId: q.id,
      index: idx,
      question: q.question,
      code: q.code,
      type: q.type,
      topic: q.topic,
      options: q.options,
      selectedAnswer: selected !== undefined ? selected : null,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    }
  })

  // 1. Calculate exact score percentage from actual answers
  const scorePercentage = Math.round((correctCount / questions.length) * 100)

  // 2. Calculate Star System:
  // 90–100: ⭐⭐⭐⭐⭐
  // 80–89: ⭐⭐⭐⭐
  // 70–79: ⭐⭐⭐
  // 60–69: ⭐⭐
  // Below 60: ⭐
  let starsCount = 1
  let starString = '⭐'
  if (scorePercentage >= 90) {
    starsCount = 5
    starString = '⭐⭐⭐⭐⭐'
  } else if (scorePercentage >= 80) {
    starsCount = 4
    starString = '⭐⭐⭐⭐'
  } else if (scorePercentage >= 70) {
    starsCount = 3
    starString = '⭐⭐⭐'
  } else if (scorePercentage >= 60) {
    starsCount = 2
    starString = '⭐⭐'
  } else {
    starsCount = 1
    starString = '⭐'
  }

  // 3. Calculate Score Breakdown across 5 categories from actual answers
  const dimStats = {
    conceptUnderstanding: { total: 0, correct: 0 },
    practicalApplication: { total: 0, correct: 0 },
    problemSolving: { total: 0, correct: 0 },
    codeQuality: { total: 0, correct: 0 },
    bestPractices: { total: 0, correct: 0 },
  }

  review.forEach((item) => {
    const dims = getQuestionDimensions(item)
    dims.forEach((dim) => {
      dimStats[dim].total++
      if (item.isCorrect) dimStats[dim].correct++
    })
  })

  const breakdown = {}
  for (const [key, stats] of Object.entries(dimStats)) {
    if (stats.total > 0) {
      breakdown[key] = Math.round((stats.correct / stats.total) * 100)
    } else {
      // Deterministically aligned with actual score achieved
      breakdown[key] = scorePercentage
    }
  }

  // 4. Detailed Feedback derived from actual answers
  const wrongQuestions = review.filter((q) => !q.isCorrect)
  const correctQuestions = review.filter((q) => q.isCorrect)

  const topicsWrong = Array.from(new Set(wrongQuestions.map((q) => q.topic).filter(Boolean)))
  const topicsCorrect = Array.from(new Set(correctQuestions.map((q) => q.topic).filter(Boolean)))

  let whatYouDidWell = ''
  if (scorePercentage === 100) {
    whatYouDidWell = `Flawless execution! You demonstrated mastery across all tested ${technology} concepts (${topicsCorrect.join(', ')}), with 100% accuracy and optimal analytical reasoning.`
  } else if (topicsCorrect.length > 0) {
    whatYouDidWell = `Demonstrated solid proficiency in: ${topicsCorrect.join(', ')}. Strong problem-solving on core conceptual and output prediction questions.`
  } else {
    whatYouDidWell = `Completed the full test under timed conditions. Showed persistence through complex questions and established a clear starting baseline.`
  }

  let whatYouNeedToImprove = ''
  if (scorePercentage === 100) {
    whatYouNeedToImprove = `Maintain this high benchmark! Continue exploring advanced architecture trade-offs, high-load optimization, and production failure recovery.`
  } else if (topicsWrong.length > 0) {
    whatYouNeedToImprove = `Targeted improvement needed in: ${topicsWrong.join(', ')}. Focus on lifecycle nuances, error boundaries, and edge-case handling.`
  } else {
    whatYouNeedToImprove = `Comprehensive review required for fundamentals, core APIs, and syntax semantics before taking your next test.`
  }

  // Recommendations
  const techKey = technology.toLowerCase().replace(/[^a-z-]/g, '')
  const techDefaults = TECH_RECOMMENDATIONS[techKey] || TECH_RECOMMENDATIONS.react

  // Curate recommended learning topics
  const recommendedLearningTopics = [...techDefaults.learning]
  if (topicsWrong.length > 0) {
    recommendedLearningTopics.unshift(`Deep Dive: ${topicsWrong[0]} Fundamentals & Common Pitfalls`)
  }

  const recommendedPractice = [...techDefaults.practice]
  const nextSteps = [...techDefaults.nextSteps]

  let grade = 'Needs Practice'
  if (scorePercentage >= 90) grade = 'Mastery / Advanced'
  else if (scorePercentage >= 80) grade = 'Strong Proficiency'
  else if (scorePercentage >= 70) grade = 'Competent / Passing'
  else if (scorePercentage >= 60) grade = 'Developing Competence'

  return {
    testId,
    technology,
    difficulty,
    totalQuestions: questions.length,
    correctCount,
    incorrectCount: questions.length - correctCount,
    score: scorePercentage,
    scoreOutOf100: `${scorePercentage}/100`,
    scorePercentage,
    starsCount,
    starString,
    breakdown,
    feedback: {
      whatYouDidWell,
      whatYouNeedToImprove,
      topicsWrong,
      recommendedLearningTopics: recommendedLearningTopics.slice(0, 4),
      recommendedPractice: recommendedPractice.slice(0, 4),
    },
    nextSteps: nextSteps.slice(0, 4),
    grade,
    timeSpentSeconds,
    review,
    submittedAt: new Date().toISOString(),
  }
}
