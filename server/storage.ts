import {
  users, type User, type InsertUser,
  blogs, type Blog, type InsertBlog, type BlogWithRelations,
  categories, type Category, type InsertCategory,
  authors, type Author, type InsertAuthor,
  comments, type Comment, type InsertComment, type CommentWithReplies
} from "@shared/schema";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods (from existing template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog methods
  getAllBlogs(): Promise<BlogWithRelations[]>;
  getFeaturedBlog(): Promise<BlogWithRelations | undefined>;
  getBlogById(id: number): Promise<BlogWithRelations | undefined>;
  getBlogBySlug(slug: string): Promise<BlogWithRelations | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlogViews(id: number): Promise<void>;
  updateBlogLikes(id: number, increment: boolean): Promise<void>;
  getRelatedBlogs(blogId: number, limit?: number): Promise<BlogWithRelations[]>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Author methods
  getAllAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;

  // Comment methods
  getCommentsByBlogId(blogId: number): Promise<CommentWithReplies[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateCommentLikes(id: number, increment: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogs: Map<number, Blog>;
  private categories: Map<number, Category>;
  private authors: Map<number, Author>;
  private comments: Map<number, Comment>;
  currentUserId: number;
  currentBlogId: number;
  currentCategoryId: number;
  currentAuthorId: number;
  currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.blogs = new Map();
    this.categories = new Map();
    this.authors = new Map();
    this.comments = new Map();
    this.currentUserId = 1;
    this.currentBlogId = 1;
    this.currentCategoryId = 1;
    this.currentAuthorId = 1;
    this.currentCommentId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add categories
    const categories = [
      { name: "Travel", slug: "travel" },
      { name: "Food", slug: "food" },
      { name: "Culture", slug: "culture" },
      { name: "Nature", slug: "nature" },
      { name: "History", slug: "history" }
    ];
    
    categories.forEach(cat => this.createCategory(cat));

    // Add authors
    const authors = [
      { name: "Naomi Chen", bio: "Travel writer and photographer based in Singapore with a passion for exploring Asia's hidden cultural treasures.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "Travel Writer & Photographer" },
      { name: "Erik Johansson", bio: "Adventure enthusiast and nature lover with a background in environmental science.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "Adventure Guide" },
      { name: "Priya Sharma", bio: "Culinary expert with a love for traditional cooking techniques and street food discoveries.", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "Food Critic & Chef" },
      { name: "Carlos Mendoza", bio: "Anthropologist specializing in indigenous cultures of Latin America.", avatar: "https://randomuser.me/api/portraits/men/75.jpg", role: "Cultural Anthropologist" }
    ];
    
    authors.forEach(author => this.createAuthor(author));

    // Add blogs
    const blogs = [
      {
        title: "Exploring the Hidden Gems of Tokyo: Beyond the Tourist Trails",
        slug: "exploring-hidden-gems-tokyo",
        excerpt: "Discover the local side of Tokyo that most tourists never see. From secret garden hideaways to neighborhood izakayas, experience Japan's capital like a local.",
        content: `<p>When most travelers think of Tokyo, images of neon-lit Shibuya, the famous Tsukiji fish market, and crowds of tourists at Senso-ji Temple immediately come to mind. But there's a whole other side to Japan's fascinating capital – one that locals treasure and few tourists ever discover.</p>
        
        <p>My journey through Tokyo's hidden corners began in <strong>Yanaka</strong>, one of the few districts that survived the bombings of World War II. Here, traditional wooden houses line narrow streets, and the atmosphere feels more like a small town than part of the world's largest metropolitan area.</p>
        
        <h2>Discovering Yanaka Ginza</h2>
        
        <p>The heart of Yanaka is its shotengai (shopping street) called Yanaka Ginza. Unlike the upscale Ginza district downtown, this charming street is filled with small family-owned shops that have been operating for generations. From traditional Japanese sweets to handcrafted items, each store tells a story of Japanese craftsmanship.</p>
        
        <p>One particular highlight is Kabaya Coffee, a tiny shop tucked away on a side street. The owner, Kabaya-san, has been roasting beans the traditional way for over 40 years. The rich aroma fills the narrow space as he carefully prepares each cup with methodical precision.</p>
        
        <h2>Secret Gardens and Temples</h2>
        
        <p>While Shinjuku Gyoen and Ueno Park are beautiful (and rightfully popular), Tokyo hides countless smaller gardens that offer tranquility away from the crowds. Kiyosumi Garden in the eastern Fukagawa district is one such place – a traditional Japanese landscape garden originally built for a wealthy merchant during the Edo period.</p>
        
        <p>What makes this garden special is its collection of stepping stones brought from all across Japan. Each carefully placed stone creates paths across small ponds, allowing visitors to feel as if they're walking on water.</p>
        
        <p>Japan is known for its relationship with nature, and despite being a massive urban center, Tokyo maintains this connection through these carefully preserved green spaces.</p>
        
        <h2>Local Food Beyond Sushi</h2>
        
        <p>No travel article about Japan would be complete without mentioning food, but I want to highlight experiences beyond the typical sushi restaurants that appear in every guidebook.</p>
        
        <p>In Sunamachi Ginza, another local shopping street in eastern Tokyo, you'll find food vendors that have been perfecting single dishes for decades. One standout is Kawasaki Choten, where the specialty is <em>monjayaki</em> – Tokyo's lesser-known cousin to okonomiyaki. This savory pancake-like dish is made with a much thinner batter, creating a unique texture that locals adore.</p>
        
        <h2>Final Thoughts</h2>
        
        <p>Tokyo rewards the curious traveler who's willing to venture beyond the well-trodden tourist path. By exploring neighborhoods like Yanaka, Kiyosumi, and Sunamachi, you'll experience a side of Tokyo that reveals the city's true character – a place where tradition and innovation exist in perfect harmony.</p>
        
        <p>As you plan your next trip to Japan, consider setting aside a few days to explore these hidden corners. You might not return home with photos of Tokyo Tower or Shibuya Crossing, but you'll have experienced the authentic Tokyo that locals know and love.</p>`,
        coverImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
        categoryId: 1,
        authorId: 1,
        readTime: 5,
        isFeatured: 1,
        tags: ["tokyo", "japan", "travel", "culture", "food", "gardens"]
      },
      {
        title: "Norway's Stunning Fjords: A Journey Through Scandinavia's Natural Wonders",
        slug: "norway-stunning-fjords",
        excerpt: "Experience the breathtaking beauty of Norway's fjords, where dramatic landscapes meet serene waters, creating one of Earth's most spectacular natural settings.",
        content: `<p>Norway's fjords are nothing short of magnificent - a testament to the raw power of glacial forces that shaped this stunning landscape over millennia. As I stood at the edge of Geirangerfjord, a UNESCO World Heritage site, I was struck by the sheer scale of the surroundings. Towering cliffs rise dramatically from crystal-clear waters, creating a landscape that seems almost too perfect to be real.</p>

        <h2>The Formation of Nature's Masterpiece</h2>
        
        <p>Fjords were formed during the Ice Age when massive glaciers carved deep valleys into the mountainous terrain. As the glaciers retreated and sea levels rose, these valleys flooded with seawater, creating the dramatic inlets we see today. While fjords exist in several countries with glacial histories, Norway's are particularly spectacular due to their depth, clarity, and the surrounding mountains.</p>
        
        <p>The depth of these natural wonders is astounding - Sognefjord, Norway's deepest and longest fjord, plunges to over 1,300 meters (4,265 feet) below sea level. The water in these fjords is a unique mixture of freshwater from mountain streams and saltwater from the sea, creating a distinctive ecosystem.</p>
        
        <h2>Experiencing the Fjords</h2>
        
        <p>There's no single "best" way to experience Norway's fjords - each approach offers a different perspective. Cruising through the narrow waterways provides an immersive experience, with waterfalls cascading down cliffs on either side. The famous "Seven Sisters" waterfall in Geirangerfjord consists of seven separate streams falling side by side down the mountain face.</p>
        
        <p>Hiking the surrounding mountains offers breathtaking panoramic views. The trail to Pulpit Rock (Preikestolen) above Lysefjord is particularly famous, ending at a flat cliff plateau about 604 meters (1,982 feet) above the fjord. Standing at the edge provides an exhilarating - if somewhat vertigo-inducing - perspective of the landscape below.</p>
        
        <h2>Life Along the Fjords</h2>
        
        <p>What struck me most during my journey was how Norwegians have adapted to this challenging terrain. Tiny farms cling to small patches of flat land on the mountainsides, some accessible only by boat. These remote homesteads have existed for centuries, with families living in harmony with the dramatic landscape.</p>
        
        <p>The small villages nestled along the shores have a timeless quality. In Flåm, at the end of Aurlandsfjord, colorful wooden buildings house cafes and shops selling local crafts. The famous Flåm Railway, one of the steepest standard-gauge railway lines in the world, winds its way up the mountains, providing spectacular views at every turn.</p>
        
        <h2>Preserving Natural Wonder</h2>
        
        <p>Norway takes the stewardship of its natural treasures seriously. The fjord regions have strict environmental protection measures in place, and Norway is at the forefront of developing eco-friendly tourism practices. The introduction of electric ferries in the fjords is just one example of how the country is working to preserve the pristine nature of these waterways for future generations.</p>
        
        <p>As our world becomes increasingly urbanized and developed, places like Norway's fjords remind us of the majesty of untamed nature. They stand as monuments to geological forces beyond human comprehension and provide a humbling perspective on our place in the natural world.</p>`,
        coverImage: "https://images.unsplash.com/photo-1551649001-7a211404ce40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        categoryId: 4,
        authorId: 2,
        readTime: 4,
        isFeatured: 0,
        tags: ["norway", "fjords", "travel", "nature", "scandinavia", "landscapes"]
      },
      {
        title: "The Street Food Revolution of India: From Chaat to Global Sensation",
        slug: "street-food-revolution-india",
        excerpt: "Dive into India's vibrant street food culture that has captivated food lovers worldwide. From the spicy chaats of Delhi to the sweet treats of Kolkata.",
        content: `<p>India's street food scene is a symphony of flavors, colors, and textures that has been perfected over generations. Walking through the bustling streets of any Indian city, you're immediately enveloped by the intoxicating aromas wafting from countless food stalls, each with its own specialty and loyal following.</p>

        <h2>The Heart of Indian Cuisine</h2>
        
        <p>While fine dining restaurants might showcase elaborate preparations and elegant presentations, it's on the streets where you'll find the heart and soul of Indian cooking. Street food in India isn't just convenient or affordable – it's an essential cultural institution that transcends class boundaries. You'll find everyone from office workers to film stars queuing up at their favorite street vendors.</p>
        
        <p>Each region of India has developed its own street food specialties, reflecting local ingredients, historical influences, and cultural preferences. This regional diversity is what makes exploring Indian street food such an endless adventure.</p>
        
        <h2>Delhi: The Chaat Capital</h2>
        
        <p>Delhi is often considered the street food capital of India, particularly famous for its chaat – savory snacks that combine multiple textures and flavors. The quintessential Dilli chaat includes:</p>
        
        <p>Gol Gappas (or Pani Puri) – Hollow crisp spheres filled with spiced potato and chickpeas, then dipped in tangy, mint-infused water. The entire preparation is popped into the mouth at once, creating an explosion of flavor.</p>
        
        <p>Aloo Tikki – Spiced potato patties, shallow fried until golden brown, then topped with yogurt, tamarind chutney, and a sprinkle of chaat masala. The combination of hot, cold, sweet, spicy, and tangy elements is characteristic of chaat preparations.</p>
        
        <p>The Old Delhi neighborhood of Chandni Chowk is particularly renowned for its food streets, where many establishments have been run by the same families for generations, their recipes closely guarded secrets.</p>
        
        <h2>Mumbai's Iconic Street Foods</h2>
        
        <p>Mumbai's street food has developed its own distinctive character, influenced by the city's coastal location and diverse population. Vada Pav – often called the "Indian burger" – consists of a spiced potato fritter sandwiched in a bread roll with various chutneys. This humble creation is Mumbai's most iconic street food, originally created as an affordable meal for textile mill workers.</p>
        
        <p>Pav Bhaji is another Mumbai classic – a spiced vegetable mash served with butter-toasted bread rolls. Created as a quick meal for textile mill workers in the 1850s, it's now enjoyed throughout India and beyond.</p>
        
        <h2>The Global Influence</h2>
        
        <p>In recent years, Indian street food has gone global, with chaat counters and dosa stalls appearing in food halls from New York to London. This international recognition has sparked a newfound appreciation within India as well, with upscale interpretations of street classics appearing on the menus of fine dining establishments.</p>
        
        <p>Food historians and chefs have begun documenting and preserving street food recipes, recognizing their cultural significance and the knowledge of the vendors who have perfected these dishes over decades of daily practice.</p>
        
        <p>What makes Indian street food so captivating is not just the flavors but the entire sensory experience – watching the rapid hand movements of vendors as they assemble dishes with practiced precision, hearing the sizzle of ingredients hitting hot surfaces, and joining the crowd of eager customers. It's street theater where food is the star, and everyone is invited to the show.</p>`,
        coverImage: "https://images.unsplash.com/photo-1604697803931-0190de242d31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        categoryId: 2,
        authorId: 3,
        readTime: 6,
        isFeatured: 0,
        tags: ["india", "street food", "cuisine", "culture", "travel", "food"]
      },
      {
        title: "The Ancient Wisdom of Peru: Traditions That Survived Centuries",
        slug: "ancient-wisdom-peru",
        excerpt: "Explore how Peru's indigenous cultures have preserved their knowledge and traditions through colonization and modernization, creating a unique cultural tapestry.",
        content: `<p>High in the Andes Mountains, where the air is thin and the landscape dramatic, Peru's indigenous communities have preserved ancient knowledge systems that date back thousands of years. These traditions have survived conquest, colonization, and globalization, adapting while maintaining their core essence.</p>

        <h2>Guardians of Traditional Knowledge</h2>
        
        <p>In the village of Q'eros, often called the "last Inca community," residents continue practices that have been passed down through generations since the time of the Inca Empire. These isolated communities, living at elevations above 14,000 feet, have become known as the keepers of traditional Andean spiritual wisdom.</p>
        
        <p>Q'eros spiritual leaders, known as <em>paqos</em>, maintain a sophisticated understanding of the natural world based on the concept of <em>ayni</em> (reciprocity). This worldview sees humans not as masters of nature but as participants in a mutual exchange. When something is taken from the earth, something must be given back – a principle that guided sustainable agricultural practices long before modern environmentalism.</p>
        
        <h2>Agricultural Innovation and Food Security</h2>
        
        <p>Perhaps nowhere is ancient wisdom more evident than in Peru's agricultural traditions. The country's indigenous farmers domesticated potatoes, quinoa, and many other crops that are now consumed worldwide. They developed sophisticated farming systems adapted to the challenging Andean environment.</p>
        
        <p>The terraced fields that climb the mountainsides throughout the Sacred Valley aren't just historically interesting – many remain in active use. These agricultural terraces, known as <em>andenes</em>, create microclimates that protect crops from frost while efficiently managing water resources. The design is so effective that some terraces built by the Incas over 500 years ago still function perfectly today.</p>
        
        <p>In the Lake Titicaca region, farmers still construct <em>waru waru</em> or raised fields surrounded by water channels. This ancient technique creates a thermal buffer that protects crops from the harsh high-altitude frosts. During a severe drought in the 1980s, farms using these reconstructed ancient methods survived while modern farms failed, leading to renewed interest in indigenous agricultural knowledge.</p>
        
        <h2>Textile Traditions as Living History</h2>
        
        <p>The textile traditions of Peru represent another form of preserved knowledge. In communities throughout the Andes, weaving techniques passed down through generations create textiles that are both beautiful and culturally significant.</p>
        
        <p>In the village of Chinchero, master weavers like Nilda Callañaupa have established centers to ensure these techniques aren't lost. Each pattern and motif in traditional textiles tells a story – about local geography, historical events, or spiritual beliefs. The textiles serve as a form of non-written language, preserving cultural memory through symbols and designs.</p>
        
        <p>The natural dyeing process itself represents sophisticated chemical knowledge developed over centuries. Weavers understand precisely which plants, minerals, and even insects produce specific colors, and how mordants like salt or lemon juice can modify and fix these colors.</p>
        
        <h2>Medical Knowledge and Plant Wisdom</h2>
        
        <p>Traditional healers, known as <em>curanderos</em>, maintain extensive knowledge about the medicinal properties of local plants. The steep slopes of the Andes, with their many ecological zones, host extraordinary biodiversity that has been thoroughly studied by indigenous healers.</p>
        
        <p>Many plants used in traditional Peruvian medicine have been scientifically validated for their medicinal properties. <em>Uña de gato</em> (cat's claw) has demonstrated anti-inflammatory effects, while <em>maca</em> root has been confirmed to boost energy and fertility, as traditional healers have long claimed.</p>
        
        <p>In the Amazon region, shamanic traditions incorporate plant medicines like ayahuasca as part of spiritual and healing practices. These traditions view health holistically, addressing physical, psychological, and spiritual aspects simultaneously.</p>
        
        <h2>Preserving Wisdom in Modern Times</h2>
        
        <p>Today, Peru faces the challenge of balancing modernization with cultural preservation. Climate change threatens agricultural traditions, while economic pressures pull younger generations toward cities and away from traditional knowledge systems.</p>
        
        <p>Yet there are hopeful signs. Cultural pride is growing, with many young Peruvians choosing to reconnect with their heritage. Government programs now include indigenous languages like Quechua in school curricula, while some universities offer programs in traditional medicine alongside conventional medical training.</p>
        
        <p>The wisdom preserved in Peru's indigenous traditions offers valuable lessons for our contemporary world – about sustainable resource management, community resilience, and harmonious relationships with the natural environment. As global challenges like climate change and food insecurity intensify, these ancient knowledge systems may prove more relevant than ever.</p>`,
        coverImage: "https://images.unsplash.com/photo-1519211975560-4ca611f5a72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        categoryId: 3,
        authorId: 4,
        readTime: 7,
        isFeatured: 0,
        tags: ["peru", "culture", "traditions", "history", "indigenous", "andes"]
      }
    ];
    
    blogs.forEach(blog => this.createBlog(blog));

    // Add comments
    const comments = [
      {
        blogId: 1,
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        content: "I visited Tokyo last year but missed all these places! Saving this for my next trip. The garden photos are absolutely stunning.",
        likeCount: 23,
      },
      {
        blogId: 1,
        name: "Naomi Chen",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "Thank you, Sarah! Kiyosumi Garden is particularly beautiful during fall when the leaves change color. I hope you get to visit it next time!",
        parentId: 1,
        likeCount: 8,
      },
      {
        blogId: 1,
        name: "David Kim",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        content: "Really enjoyed your take on Tokyo's less-visited areas. I've been to Yanaka before and it's truly magical, especially early in the morning before the shops open. One thing I'd add is that the Yanaka Cemetery is also worth visiting - beautiful cherry blossoms in spring and it has a unique atmosphere.",
        likeCount: 15,
      },
    ];
    
    comments.forEach(comment => this.createComment(comment));
  }

  // User methods (from existing template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog methods
  async getAllBlogs(): Promise<BlogWithRelations[]> {
    const blogsArray = Array.from(this.blogs.values());
    return blogsArray.map(blog => this.enrichBlogWithRelations(blog));
  }

  async getFeaturedBlog(): Promise<BlogWithRelations | undefined> {
    const featuredBlog = Array.from(this.blogs.values()).find(blog => blog.isFeatured === 1);
    if (!featuredBlog) return undefined;
    return this.enrichBlogWithRelations(featuredBlog);
  }

  async getBlogById(id: number): Promise<BlogWithRelations | undefined> {
    const blog = this.blogs.get(id);
    if (!blog) return undefined;
    return this.enrichBlogWithRelations(blog);
  }

  async getBlogBySlug(slug: string): Promise<BlogWithRelations | undefined> {
    const blog = Array.from(this.blogs.values()).find(blog => blog.slug === slug);
    if (!blog) return undefined;
    return this.enrichBlogWithRelations(blog);
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.currentBlogId++;
    const blog: Blog = {
      ...insertBlog,
      id,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      publishedAt: new Date(),
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlogViews(id: number): Promise<void> {
    const blog = this.blogs.get(id);
    if (blog) {
      blog.viewCount += 1;
      this.blogs.set(id, blog);
    }
  }

  async updateBlogLikes(id: number, increment: boolean): Promise<void> {
    const blog = this.blogs.get(id);
    if (blog) {
      blog.likeCount = increment ? blog.likeCount + 1 : Math.max(0, blog.likeCount - 1);
      this.blogs.set(id, blog);
    }
  }

  async getRelatedBlogs(blogId: number, limit = 3): Promise<BlogWithRelations[]> {
    const blog = this.blogs.get(blogId);
    if (!blog) return [];

    // Get blogs in the same category
    const relatedBlogs = Array.from(this.blogs.values())
      .filter(b => b.id !== blogId && b.categoryId === blog.categoryId)
      .slice(0, limit);

    return relatedBlogs.map(blog => this.enrichBlogWithRelations(blog));
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id, count: 0 };
    this.categories.set(id, category);
    return category;
  }

  // Author methods
  async getAllAuthors(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }

  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.authors.get(id);
  }

  async createAuthor(insertAuthor: InsertAuthor): Promise<Author> {
    const id = this.currentAuthorId++;
    const author: Author = { ...insertAuthor, id };
    this.authors.set(id, author);
    return author;
  }

  // Comment methods
  async getCommentsByBlogId(blogId: number): Promise<CommentWithReplies[]> {
    const allComments = Array.from(this.comments.values())
      .filter(comment => comment.blogId === blogId);
    
    // Separate root comments and replies
    const rootComments = allComments.filter(comment => !comment.parentId);
    const replies = allComments.filter(comment => comment.parentId);
    
    // Add replies to their parent comments
    return rootComments.map(rootComment => {
      const commentReplies = replies.filter(reply => reply.parentId === rootComment.id);
      return {
        ...rootComment,
        replies: commentReplies,
      };
    });
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      likeCount: 0,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);

    // Update comment count on the blog
    const blog = this.blogs.get(insertComment.blogId);
    if (blog) {
      blog.commentCount += 1;
      this.blogs.set(blog.id, blog);
    }

    return comment;
  }

  async updateCommentLikes(id: number, increment: boolean): Promise<void> {
    const comment = this.comments.get(id);
    if (comment) {
      comment.likeCount = increment ? comment.likeCount + 1 : Math.max(0, comment.likeCount - 1);
      this.comments.set(id, comment);
    }
  }

  // Helper methods
  private enrichBlogWithRelations(blog: Blog): BlogWithRelations {
    const category = this.categories.get(blog.categoryId) as Category;
    const author = this.authors.get(blog.authorId) as Author;
    return { ...blog, category, author };
  }
}

export const storage = new MemStorage();
