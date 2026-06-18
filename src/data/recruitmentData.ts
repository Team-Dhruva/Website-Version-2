export const DEPARTMENTS: Record<string, string> = {
  ae: "Aerospace Engineering",
  bt: "Biotechnology",
  cd: "Computer Science (Data Science)",
  cy: "Computer Science (Cyber Security)",
  ai: "Artificial Intelligence",
  cs: "Computer Science",
  ec: "Electronics and Communication",
  cv: "Civil Engineering",
  ee: "Electrical and Electronics",
  im: "Industrial Engineering and Management",
  me: "Mechanical Engineering",
  is: "Information Science",
  et: "Electronics and Telecommunication",
  ch: "Chemical Engineering",
};

export interface Recruit {
  name: string;
  semester: string;
}

export interface EpochData {
  epoch: string;
  label: string;
  recruits: Record<string, Recruit[]>;
}

export const RECRUITMENT_DATA: Record<string, EpochData> = {
  "J2023.6": {
    epoch: "J2023.6",
    label: "Epoch J2023.6",
    recruits: {}
  },
  "J2024.7": {
    epoch: "J2024.7",
    label: "Epoch J2024.7",
    recruits: {
      ae: [
        { name: "Mahathi", semester: "1st Semester" },
        { name: "Disha Sonawane", semester: "1st Semester" },
        { name: "Nadimpalli Sree Bala Bhaskara Varma", semester: "1st Semester" },
        { name: "Tanvee Chandan Mehta", semester: "1st Semester" },
        { name: "K Dhruv Bhandarkar", semester: "1st Semester" },
        { name: "Prithvi Krishna Shambhu", semester: "1st Semester" },
        { name: "Chinmaya Hegde", semester: "1st Semester" },
        { name: "Treya Moodithaya", semester: "1st Semester" },
        { name: "Hansel Biju Mathew", semester: "1st Semester" },
        { name: "Vedanth R Bhat", semester: "1st Semester" },
        { name: "Aditi Shenai", semester: "1st Semester" },
        { name: "Mohd Saad Khan", semester: "1st Semester" },
        { name: "Sankalp", semester: "3rd Semester" }
      ],
      ai: [
        { name: "Rafi Sojan S", semester: "1st Semester" },
        { name: "Shreesha D R", semester: "1st Semester" },
        { name: "Aaditya Sharma", semester: "1st Semester" },
        { name: "J Jerome Antony", semester: "1st Semester" },
        { name: "Sambhav Badaya", semester: "1st Semester" },
        { name: "Mohammed Suhayb", semester: "1st Semester" },
        { name: "Aprameya Muralidhara Yelanduru", semester: "1st Semester" },
        { name: "Abhinav Mallela", semester: "1st Semester" },
        { name: "Rahul Sachin Shinde", semester: "1st Semester" },
        { name: "Sharvani Mysoremath", semester: "1st Semester" },
        { name: "Udit H", semester: "1st Semester" },
        { name: "Tejas Anand", semester: "3rd Semester" },
        { name: "Vineet Raj", semester: "3rd Semester" }
      ],
      cy: [
        { name: "Nischal S G", semester: "1st Semester" },
        { name: "Suryanshu Das", semester: "1st Semester" },
        { name: "Yashas M N", semester: "3rd Semester" }
      ],
      cd: [
        { name: "Manoj Gupta D B", semester: "1st Semester" },
        { name: "Anurag G Kharvi", semester: "1st Semester" },
        { name: "Satwik Ray", semester: "1st Semester" },
        { name: "Samartha K B", semester: "1st Semester" }
      ],
      cs: [
        { name: "Rishon Thomas Joby", semester: "1st Semester" },
        { name: "Aarti S Pai", semester: "1st Semester" },
        { name: "Bruce Michael C.", semester: "1st Semester" },
        { name: "Ishaan Snehal Parikh", semester: "1st Semester" },
        { name: "Advik Aggarwal", semester: "1st Semester" },
        { name: "Priyansh Gupta", semester: "1st Semester" },
        { name: "Nithyashree S", semester: "1st Semester" },
        { name: "R C Sparsha", semester: "1st Semester" },
        { name: "Shaan D", semester: "1st Semester" },
        { name: "Naga Sathya", semester: "1st Semester" },
        { name: "Sharvari S", semester: "1st Semester" },
        { name: "Punith A M", semester: "1st Semester" },
        { name: "Anushka Arvind Shukla", semester: "1st Semester" },
        { name: "Srujan Nadig", semester: "1st Semester" },
        { name: "Sakshi A S", semester: "3rd Semester" },
        { name: "Varun Dhandharia", semester: "3rd Semester" },
        { name: "Vikas K T", semester: "3rd Semester" },
        { name: "Chhavi Pareek", semester: "3rd Semester" },
        { name: "Surya Narayan M", semester: "3rd Semester" }
      ],
      ec: [
        { name: "D. Kanish Chinvar", semester: "1st Semester" },
        { name: "Vishwatej M", semester: "1st Semester" },
        { name: "Ashish H", semester: "1st Semester" },
        { name: "Shrihari R Kavale", semester: "1st Semester" },
        { name: "Srikanth Ramisetti", semester: "1st Semester" },
        { name: "Thrupthi H L", semester: "1st Semester" },
        { name: "Y Sanjana", semester: "1st Semester" },
        { name: "Vishwanath Madage", semester: "1st Semester" },
        { name: "Ramesh Chandra Jaiswal", semester: "1st Semester" },
        { name: "Kanarlaparti Sanketh", semester: "1st Semester" },
        { name: "Gouri Prakash", semester: "1st Semester" },
        { name: "Dasi Venkata Pranitha", semester: "1st Semester" },
        { name: "Abhinav Racha Battuni", semester: "1st Semester" },
        { name: "Samuel Rasquinha", semester: "1st Semester" },
        { name: "Snigdha Raj", semester: "1st Semester" },
        { name: "Adishesh Jayathirtha", semester: "1st Semester" },
        { name: "Akash S", semester: "1st Semester" },
        { name: "Abel Paul N", semester: "1st Semester" },
        { name: "Jayanth M", semester: "1st Semester" },
        { name: "Manasa M", semester: "1st Semester" },
        { name: "Shashank Channamallikarjuna", semester: "1st Semester" },
        { name: "Aditya Abhigyan", semester: "3rd Semester" },
        { name: "Pranav B Hegde", semester: "3rd Semester" },
        { name: "Sneha S Nayak", semester: "3rd Semester" },
        { name: "Vaibhavi D", semester: "3rd Semester" },
        { name: "T Harshitha", semester: "3rd Semester" }
      ],
      cv: [
        { name: "Madhu Nandan M", semester: "1st Semester" }
      ],
      ee: [
        { name: "Bedant Shaurya", semester: "1st Semester" },
        { name: "Aman Goel", semester: "3rd Semester" },
        { name: "Siddharth Krishna", semester: "3rd Semester" }
      ],
      bt: [
        { name: "Niyathi Atyam", semester: "1st Semester" },
        { name: "Prateeksha Praveen Kamath", semester: "1st Semester" },
        { name: "Ananya Sudarsan", semester: "3rd Semester" },
        { name: "Sanjana Appa Kadpodkar", semester: "3rd Semester" }
      ],
      is: [
        { name: "Ibrahim Kasheef", semester: "1st Semester" },
        { name: "Haarshita Mahapatra", semester: "1st Semester" },
        { name: "Meghana J L", semester: "3rd Semester" },
        { name: "Mohammad Oweis", semester: "3rd Semester" }
      ],
      me: [
        { name: "Heer Maloo", semester: "1st Semester" },
        { name: "Aaditya P Sedamkar", semester: "1st Semester" },
        { name: "Harshini K Balaji", semester: "1st Semester" },
        { name: "Nishtha Chakraborty", semester: "1st Semester" },
        { name: "Nihit Baheriya", semester: "1st Semester" },
        { name: "Srishti Samadhan Jahagirdar", semester: "1st Semester" },
        { name: "Shrish Maheshwari", semester: "1st Semester" },
        { name: "Anvin Vipin", semester: "1st Semester" }
      ],
      et: [
        { name: "V Hardik Naidu", semester: "1st Semester" },
        { name: "Krti Pandey", semester: "1st Semester" },
        { name: "Aryan Kumar", semester: "1st Semester" },
        { name: "Aditya Narayan Tiwari", semester: "1st Semester" },
        { name: "Pranati Rao", semester: "1st Semester" },
        { name: "Adithya Sakthimani", semester: "3rd Semester" },
        { name: "Sidharth Ghosh", semester: "3rd Semester" },
        { name: "Shiven Singh", semester: "3rd Semester" },
        { name: "S Shreya", semester: "3rd Semester" }
      ],
      ch: [
        { name: "Nehal Karjagi", semester: "1st Semester" }
      ],
      im: [
        { name: "Pranjal Malaiya", semester: "1st Semester" }
      ]
    }
  },
  "J2025.8": {
    epoch: "J2025.8",
    label: "Epoch J2025.8",
    recruits: {}
  },
  "J2026.9": {
    epoch: "J2026.9",
    label: "Epoch J2026.9",
    recruits: {}
  }
};
