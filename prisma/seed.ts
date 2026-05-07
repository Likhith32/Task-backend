import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.rankCutoff.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.collegeCourse.deleteMany();
  await prisma.college.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('📚 Creating courses...');
  const courseNames = [
    'CSE', 'ECE', 'Mechanical', 'Civil', 'AI & DS',
    'Mathematics & Computing', 'Textile Technology', 'Chemical', 'Electrical', 'Physics',
    'Mathematics', 'Bio-Engineering', 'Computer Science', 'Pharmacy', 'Economics',
    'Aerospace', 'Naval Architecture', 'Data Science', 'EEE', 'Production',
    'Instrumentation', 'Information Technology', 'Biotech', 'Electronics', 'Materials Science',
    'Biological Sciences', 'Software Engineering', 'Environmental Engineering', 'Automobile',
    'Power Engineering', 'Printing Technology'
  ];

  const courses: Record<string, number> = {};
  for (const name of courseNames) {
    const course = await prisma.course.create({ data: { name } });
    courses[name] = course.id;
  }
  console.log(`✅ Created ${courseNames.length} courses`);

  console.log('🏫 Creating colleges...');
  const collegesData = [
    {
      name: 'Indian Institute of Technology Bombay',
      shortName: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      fees: 220000,
      rating: 4.9,
      placementPercentage: 96,
      averagePackageLpa: 28.00,
      highestPackageLpa: 120.00,
      exam: 'JEE Advanced',
      nirfRank: 3,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop',
      description: 'IIT Bombay is one of India\'s premier engineering institutions, renowned globally for its excellence in technology education and research. Established in 1958, it consistently ranks among the top engineering colleges in Asia. The campus spans 550 acres in Powai, Mumbai, offering state-of-the-art laboratories, a vibrant campus life, and strong industry connections that ensure exceptional placement outcomes.',
      courseNames: ['CSE', 'ECE', 'Mechanical', 'Civil', 'AI & DS']
    },
    {
      name: 'Indian Institute of Technology Delhi',
      shortName: 'IIT Delhi',
      location: 'New Delhi, Delhi',
      state: 'Delhi',
      fees: 230000,
      rating: 4.8,
      placementPercentage: 94,
      averagePackageLpa: 26.00,
      highestPackageLpa: 115.00,
      exam: 'JEE Advanced',
      nirfRank: 2,
      hostelAvailable: true,
      imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.hjeostegN2327EFXbpbUxAHaEH?pid=Api&P=0&h=180',
      description: 'IIT Delhi, established in 1961, is a prestigious institution located in the heart of the national capital. Known for its cutting-edge research in emerging technologies, strong alumni network spanning Fortune 500 companies, and a diverse academic environment. The institute offers world-class infrastructure and maintains partnerships with leading global universities.',
      courseNames: ['CSE', 'Mathematics & Computing', 'Textile Technology', 'Chemical', 'Electrical']
    },
    {
      name: 'Indian Institute of Science',
      shortName: 'IISc Bangalore',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      fees: 30000,
      rating: 4.9,
      placementPercentage: 92,
      averagePackageLpa: 30.00,
      highestPackageLpa: 85.00,
      exam: 'JEE Advanced / KVPY',
      nirfRank: 1,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&h=400&fit=crop',
      description: 'The Indian Institute of Science (IISc) is India\'s top-ranked research university, established in 1909 by Jamsetji Tata. Located in Bengaluru\'s tech hub, IISc is renowned for its research output in pure and applied sciences. With incredibly affordable fees and the highest average package among Indian institutions, it represents unparalleled value in higher education.',
      courseNames: ['Physics', 'Mathematics', 'Bio-Engineering', 'Computer Science']
    },
    {
      name: 'Birla Institute of Technology and Science',
      shortName: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      state: 'Rajasthan',
      fees: 540000,
      rating: 4.7,
      placementPercentage: 95,
      averagePackageLpa: 21.00,
      highestPackageLpa: 60.00,
      exam: 'BITSAT',
      nirfRank: 25,
      hostelAvailable: true,
      imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.jew2_bPyaAtzQEP1H8oeWAHaDt?pid=Api&P=0&h=180',
      description: 'BITS Pilani is a private institution known for its unique academic flexibility and entrepreneurial culture. Founded in 1964, it offers a Practice School program that provides extensive industry exposure. The institute has produced numerous successful entrepreneurs and tech leaders, maintaining a 95% placement rate with top recruiters from tech, consulting, and finance sectors.',
      courseNames: ['CSE', 'Electrical', 'Pharmacy', 'Mechanical', 'Economics']
    },
    {
      name: 'Indian Institute of Technology Madras',
      shortName: 'IIT Madras',
      location: 'Chennai, Tamil Nadu',
      state: 'Tamil Nadu',
      fees: 215000,
      rating: 4.9,
      placementPercentage: 93,
      averagePackageLpa: 24.00,
      highestPackageLpa: 105.00,
      exam: 'JEE Advanced',
      nirfRank: 1,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
      description: 'IIT Madras, established in 1959, is consistently ranked as India\'s #1 engineering institution by NIRF. Located within the Guindy National Park in Chennai, the 617-acre campus is known for its research parks, startup ecosystem, and strong focus on data science and AI. The institute hosts India\'s first university-based research park.',
      courseNames: ['Aerospace', 'Naval Architecture', 'CSE', 'Data Science', 'Electrical']
    },
    {
      name: 'National Institute of Technology Tiruchirappalli',
      shortName: 'NIT Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      state: 'Tamil Nadu',
      fees: 150000,
      rating: 4.6,
      placementPercentage: 91,
      averagePackageLpa: 16.00,
      highestPackageLpa: 52.00,
      exam: 'JEE Main',
      nirfRank: 9,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=400&fit=crop',
      description: 'NIT Trichy is the highest-ranked NIT in India, known for its excellent academic rigor and placement record. Established in 1964, it offers a perfect blend of affordability and quality education. The campus features modern infrastructure, active student chapters, and strong alumni connections across major tech companies worldwide.',
      courseNames: ['CSE', 'ECE', 'EEE', 'Production', 'Instrumentation']
    },
    {
      name: 'Vellore Institute of Technology',
      shortName: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      state: 'Tamil Nadu',
      fees: 198000,
      rating: 4.3,
      placementPercentage: 88,
      averagePackageLpa: 9.00,
      highestPackageLpa: 75.00,
      exam: 'VITEEE',
      nirfRank: 11,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&h=400&fit=crop',
      description: 'VIT Vellore is one of India\'s leading private universities, known for its massive placement drives and diverse student body. Founded in 1984, VIT hosts one of India\'s largest campus placement programs with 600+ companies visiting annually. The university emphasizes international exposure with 50+ global partnerships.',
      courseNames: ['CSE', 'Information Technology', 'Biotech', 'Electronics', 'Mechanical']
    },
    {
      name: 'Indian Institute of Technology Kanpur',
      shortName: 'IIT Kanpur',
      location: 'Kanpur, Uttar Pradesh',
      state: 'Uttar Pradesh',
      fees: 218000,
      rating: 4.8,
      placementPercentage: 90,
      averagePackageLpa: 25.00,
      highestPackageLpa: 110.00,
      exam: 'JEE Advanced',
      nirfRank: 4,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&h=400&fit=crop',
      description: 'IIT Kanpur, established in 1959, is a leader in scientific and engineering research. Known for pioneering computer science education in India, it maintains a strong research culture and innovative teaching methods. The 1055-acre campus houses advanced research centers and has produced multiple startup founders and industry leaders.',
      courseNames: ['CSE', 'Aerospace', 'Materials Science', 'Chemical', 'Biological Sciences']
    },
    {
      name: 'Delhi Technological University',
      shortName: 'DTU',
      location: 'Rohini, Delhi',
      state: 'Delhi',
      fees: 219000,
      rating: 4.5,
      placementPercentage: 89,
      averagePackageLpa: 18.00,
      highestPackageLpa: 64.00,
      exam: 'JEE Main',
      nirfRank: 61,
      hostelAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&h=400&fit=crop',
      description: 'Delhi Technological University (formerly DCE) is one of India\'s oldest engineering institutions, established in 1941. Located in Delhi, it benefits from proximity to the national capital\'s thriving tech industry. DTU is known for its strong placement record, active coding culture, and vibrant technical festivals.',
      courseNames: ['CSE', 'Software Engineering', 'Mathematics', 'Environmental Engineering', 'Automobile']
    },
    {
      name: 'Jadavpur University',
      shortName: 'JU Kolkata',
      location: 'Kolkata, West Bengal',
      state: 'West Bengal',
      fees: 10000,
      rating: 4.7,
      placementPercentage: 85,
      averagePackageLpa: 12.00,
      highestPackageLpa: 58.00,
      exam: 'WBJEE',
      nirfRank: 10,
      hostelAvailable: true,
      imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.yQEmOlptDYqG4s1EMksI4QHaEO?pid=Api&P=0&h=180',
      description: 'Jadavpur University, established in 1955, is one of India\'s most prestigious public universities with incredibly affordable fees. Known for its academic excellence and research contributions, JU has consistently ranked among the top universities in India. The university offers outstanding value with strong placements at minimal cost.',
      courseNames: ['CSE', 'Electronics', 'Power Engineering', 'Printing Technology', 'Chemical']
    }
  ];

  const collegeMap: Record<string, number> = {};

  for (const collegeData of collegesData) {
    const { courseNames: collegeCourseNames, ...data } = collegeData;
    const college = await prisma.college.create({
      data: {
        ...data,
        courses: {
          create: collegeCourseNames.map(courseName => ({
            courseId: courses[courseName]
          }))
        }
      }
    });
    collegeMap[college.shortName || college.name] = college.id;
  }
  console.log(`✅ Created ${collegesData.length} colleges`);

  console.log('📊 Creating rank cutoffs...');
  const cutoffData = [
    // IIT Bombay
    { collegeName: 'IIT Bombay', exam: 'JEE Advanced', courseName: 'CSE', minRank: 1, maxRank: 100 },
    { collegeName: 'IIT Bombay', exam: 'JEE Advanced', courseName: 'ECE', minRank: 101, maxRank: 400 },
    { collegeName: 'IIT Bombay', exam: 'JEE Advanced', courseName: 'Mechanical', minRank: 401, maxRank: 800 },
    // IIT Delhi
    { collegeName: 'IIT Delhi', exam: 'JEE Advanced', courseName: 'CSE', minRank: 1, maxRank: 90 },
    { collegeName: 'IIT Delhi', exam: 'JEE Advanced', courseName: 'Electrical', minRank: 91, maxRank: 350 },
    { collegeName: 'IIT Delhi', exam: 'JEE Advanced', courseName: 'Chemical', minRank: 351, maxRank: 750 },
    // IISc
    { collegeName: 'IISc Bangalore', exam: 'JEE Advanced', courseName: 'Computer Science', minRank: 1, maxRank: 500 },
    { collegeName: 'IISc Bangalore', exam: 'KVPY', courseName: 'Computer Science', minRank: 1, maxRank: 500 },
    { collegeName: 'IISc Bangalore', exam: 'JEE Advanced', courseName: 'Physics', minRank: 501, maxRank: 1200 },
    { collegeName: 'IISc Bangalore', exam: 'KVPY', courseName: 'Physics', minRank: 501, maxRank: 1200 },
    // BITS Pilani
    { collegeName: 'BITS Pilani', exam: 'BITSAT', courseName: 'CSE', minRank: 1, maxRank: 310 },
    { collegeName: 'BITS Pilani', exam: 'BITSAT', courseName: 'Electrical', minRank: 311, maxRank: 360 },
    { collegeName: 'BITS Pilani', exam: 'BITSAT', courseName: 'Mechanical', minRank: 361, maxRank: 400 },
    // IIT Madras
    { collegeName: 'IIT Madras', exam: 'JEE Advanced', courseName: 'CSE', minRank: 1, maxRank: 110 },
    { collegeName: 'IIT Madras', exam: 'JEE Advanced', courseName: 'Aerospace', minRank: 111, maxRank: 600 },
    { collegeName: 'IIT Madras', exam: 'JEE Advanced', courseName: 'Data Science', minRank: 601, maxRank: 1000 },
    // NIT Trichy
    { collegeName: 'NIT Trichy', exam: 'JEE Main', courseName: 'CSE', minRank: 1, maxRank: 2500 },
    { collegeName: 'NIT Trichy', exam: 'JEE Main', courseName: 'ECE', minRank: 2501, maxRank: 6000 },
    { collegeName: 'NIT Trichy', exam: 'JEE Main', courseName: 'EEE', minRank: 6001, maxRank: 10000 },
    // VIT Vellore
    { collegeName: 'VIT Vellore', exam: 'VITEEE', courseName: 'CSE', minRank: 1, maxRank: 5000 },
    { collegeName: 'VIT Vellore', exam: 'VITEEE', courseName: 'Information Technology', minRank: 5001, maxRank: 12000 },
    { collegeName: 'VIT Vellore', exam: 'VITEEE', courseName: 'Electronics', minRank: 12001, maxRank: 20000 },
    // IIT Kanpur
    { collegeName: 'IIT Kanpur', exam: 'JEE Advanced', courseName: 'CSE', minRank: 1, maxRank: 120 },
    { collegeName: 'IIT Kanpur', exam: 'JEE Advanced', courseName: 'Aerospace', minRank: 121, maxRank: 550 },
    { collegeName: 'IIT Kanpur', exam: 'JEE Advanced', courseName: 'Chemical', minRank: 551, maxRank: 900 },
    // DTU
    { collegeName: 'DTU', exam: 'JEE Main', courseName: 'CSE', minRank: 1, maxRank: 3500 },
    { collegeName: 'DTU', exam: 'JEE Main', courseName: 'Software Engineering', minRank: 3501, maxRank: 7000 },
    { collegeName: 'DTU', exam: 'JEE Main', courseName: 'Mathematics', minRank: 7001, maxRank: 12000 },
    // JU Kolkata
    { collegeName: 'JU Kolkata', exam: 'WBJEE', courseName: 'CSE', minRank: 1, maxRank: 800 },
    { collegeName: 'JU Kolkata', exam: 'WBJEE', courseName: 'Electronics', minRank: 801, maxRank: 2000 },
    { collegeName: 'JU Kolkata', exam: 'WBJEE', courseName: 'Chemical', minRank: 2001, maxRank: 4000 },
  ];

  for (const cutoff of cutoffData) {
    await prisma.rankCutoff.create({
      data: {
        collegeId: collegeMap[cutoff.collegeName],
        exam: cutoff.exam,
        courseId: courses[cutoff.courseName],
        minRank: cutoff.minRank,
        maxRank: cutoff.maxRank,
        year: 2024,
        category: 'General'
      }
    });
  }
  console.log(`✅ Created ${cutoffData.length} rank cutoffs`);

  console.log('⭐ Creating reviews...');
  const reviewsData = [
    // IIT Bombay
    {
      collegeName: 'IIT Bombay',
      reviews: [
        { rating: 5.0, title: 'World-class education and campus life', body: 'IIT Bombay exceeded all my expectations. The professors are brilliant, the research facilities are top-notch, and the placement cell works tirelessly to bring the best companies. The campus culture is incredibly vibrant with numerous tech fests, cultural events, and student clubs. Got placed in a top tech company with a package beyond my dreams.' },
        { rating: 4.8, title: 'Best engineering experience in India', body: 'The academic rigor at IIT Bombay is unmatched. Every course pushes you to think critically and innovate. The peer group is the smartest I\'ve ever been around. Campus infrastructure including labs, library, and sports facilities are excellent. The only minor con is the Mumbai weather, but the AC hostels make up for it!' }
      ]
    },
    // IIT Delhi
    {
      collegeName: 'IIT Delhi',
      reviews: [
        { rating: 4.9, title: 'Exceptional academics and networking', body: 'Being in the capital city gives IIT Delhi a unique advantage. The industry connections are incredible, and you get exposure to policy-making circles as well. The Mathematics & Computing program is particularly outstanding. The placement season is intense but rewarding, with both domestic and international offers.' },
        { rating: 4.7, title: 'Great blend of academics and extracurriculars', body: 'IIT Delhi has an amazing startup culture. The entrepreneurship cell is one of the most active in the country. Faculty members are accessible and supportive of research projects. The mess food has improved significantly, and the new academic buildings are state-of-the-art. Highly recommend for anyone who can crack JEE Advanced.' }
      ]
    },
    // IISc Bangalore
    {
      collegeName: 'IISc Bangalore',
      reviews: [
        { rating: 5.0, title: 'Research paradise at unbelievable fees', body: 'IISc is a hidden gem. At just ₹30,000 fees, you get access to India\'s best research infrastructure. The faculty includes Fellows of Royal Society and National Academy members. The green campus inside Bangalore city is serene. If you\'re inclined towards research and deep science, there\'s no better place in India.' },
        { rating: 4.8, title: 'The best value for money in Indian education', body: 'Coming from a middle-class family, IISc was a blessing. The stipend covers all expenses, and the academic environment is purely focused on learning and research. The average package of 30 LPA at such low fees is extraordinary. The Bangalore ecosystem also provides excellent startup and industry opportunities nearby.' }
      ]
    },
    // BITS Pilani
    {
      collegeName: 'BITS Pilani',
      reviews: [
        { rating: 4.8, title: 'Flexibility and industry exposure like no other', body: 'BITS Pilani\'s Practice School program is what sets it apart. You spend 6 months in actual companies working on real projects. The academic flexibility to choose your courses and even dual degree is fantastic. The fest culture with OASIS and APOGEE is legendary. Placement stats are consistently strong with great international offers.' },
        { rating: 4.6, title: 'Premium education worth the investment', body: 'Yes, the fees are higher than IITs, but the ROI is excellent. The peer group at BITS is incredibly driven and entrepreneurial. The campus in Rajasthan might feel isolated, but it creates a tight-knit community. The 95% placement rate speaks for itself. BITSAT preparation is less stressful than JEE, making it an excellent alternative path.' }
      ]
    },
    // IIT Madras
    {
      collegeName: 'IIT Madras',
      reviews: [
        { rating: 5.0, title: '#1 for a reason — absolutely phenomenal', body: 'IIT Madras lives up to its #1 NIRF ranking. The Research Park is a game-changer — you can work with startups and companies without leaving campus. The Data Science program is cutting-edge, and the Aerospace department has collaborations with ISRO. The deer and monkeys on campus add a unique charm to the experience!' },
        { rating: 4.8, title: 'Innovation hub of India', body: 'The startup ecosystem at IIT Madras is thriving. I\'ve seen classmates build companies worth crores during their time here. The professors encourage applied research, and the industry partnerships ensure you\'re always working on relevant problems. Chennai\'s weather takes getting used to, but the South Indian food on campus is phenomenal.' }
      ]
    },
    // NIT Trichy
    {
      collegeName: 'NIT Trichy',
      reviews: [
        { rating: 4.7, title: 'Best NIT with incredible placements', body: 'NIT Trichy is the undisputed king among NITs. The placement record is comparable to many IITs, and the fees are significantly lower. The teaching quality in CSE and ECE departments is outstanding. Pragyan, the tech fest, is nationally recognized. The campus has been recently renovated with modern facilities.' },
        { rating: 4.5, title: 'Solid education with great alumni network', body: 'What impressed me most about NIT Trichy was the alumni network. Seniors working at FAANG companies actively help with referrals and mentoring. The JEE Main cutoff is competitive but achievable. Campus life is vibrant with numerous technical and cultural clubs. The southern Indian food in the mess is actually quite good!' }
      ]
    },
    // VIT Vellore
    {
      collegeName: 'VIT Vellore',
      reviews: [
        { rating: 4.4, title: 'Massive placement drives and diverse crowd', body: 'VIT Vellore hosts one of India\'s largest placement drives with 600+ companies. The infrastructure is modern and well-maintained. International collaborations provide semester abroad opportunities. The FFCS (Fully Flexible Credit System) lets you customize your schedule. Great choice for those who miss JEE but want quality education.' },
        { rating: 4.2, title: 'Good private university with room to grow', body: 'VIT provides a solid foundation in engineering with good industry exposure. The campus is self-contained with everything you need. Research opportunities exist but require you to be proactive. The CSE placements are particularly strong with many students landing at top tech companies. Wi-Fi coverage and lab facilities have improved dramatically in recent years.' }
      ]
    },
    // IIT Kanpur
    {
      collegeName: 'IIT Kanpur',
      reviews: [
        { rating: 4.9, title: 'Pioneer of CS education in India', body: 'IIT Kanpur literally started computer science education in India, and the legacy continues. The academic freedom here is unparalleled — you can take courses across departments freely. The aerospace and materials science labs are world-class. Night canteens and the coding culture make it a unique experience. Galaxy and Antaragni fests are incredible.' },
        { rating: 4.7, title: 'Intense academics with amazing outcomes', body: 'The academic pressure at IIT Kanpur is real, but it shapes you into a problem solver. The 1055-acre campus feels like a small city. The startup incubation center has produced several successful companies. Alumni network is incredibly strong, especially in Silicon Valley. Would choose IITK again without hesitation.' }
      ]
    },
    // DTU
    {
      collegeName: 'DTU',
      reviews: [
        { rating: 4.6, title: 'Delhi advantage with strong placements', body: 'DTU\'s location in Delhi is its biggest advantage. Access to internships, networking events, and industry meetups is unmatched. The coding culture is vibrant with competitive programming teams regularly performing at nationals. The new buildings and labs are modern. Placement season sees companies like Google, Microsoft, and Goldman Sachs visiting.' },
        { rating: 4.4, title: 'Great college with improving infrastructure', body: 'DTU has been rapidly improving over the past few years. New hostels, renovated labs, and better faculty hiring have elevated the experience. The JEE Main cutoff is competitive but the education you receive is worth it. The active GitHub community and open-source contributions from students are impressive. Highly recommend the Software Engineering program.' }
      ]
    },
    // JU Kolkata
    {
      collegeName: 'JU Kolkata',
      reviews: [
        { rating: 4.8, title: 'Unbelievable quality at ₹10,000 fees', body: 'Jadavpur University at ₹10,000 annual fees is probably the best deal in Indian education. The faculty quality rivals top IITs, and the academic culture is deeply intellectual. Kolkata\'s affordable cost of living makes it even better. The university has produced some of India\'s finest engineers and scientists. WBJEE is your gateway to excellence.' },
        { rating: 4.6, title: 'Academic excellence with Bengali culture', body: 'JU combines rigorous academics with the rich cultural heritage of Kolkata. The electronics and power engineering departments are nationally recognized. Student activism and cultural events create a well-rounded experience. The only downside is limited hostel capacity, but PG accommodation nearby is very affordable. An absolute steal for the quality of education offered.' }
      ]
    }
  ];

  for (const collegeReviews of reviewsData) {
    const collegeId = collegeMap[collegeReviews.collegeName];
    for (const review of collegeReviews.reviews) {
      await prisma.review.create({
        data: {
          collegeId,
          userId: null,
          rating: review.rating,
          title: review.title,
          body: review.body
        }
      });
    }
  }
  console.log('✅ Created reviews for all colleges');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
