"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  Brain,
  Trophy,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  User,
  UserCheck,
  Shield,
  Award,
  CreditCard,
  Zap,
  Eye,
  BarChart3,
  Lightbulb,
  Target,
  TrendingUp,
  Focus,
  Heart,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  BookOpen,
  GraduationCap,
  Building2,
  FileText,
  HelpCircle,
} from "lucide-react"

// Visual Pattern Questions for IQ Test - Based on Raven's Progressive Matrices and Wechsler Adult Intelligence Scale
const VISUAL_QUESTIONS = [
  {
    id: 1,
    type: "pattern",
    question: "Which shape completes the sequence?",
    pattern: "○ ● ○ ● ○ ?",
    options: ["○", "●", "◐", "◑"],
    correct: 1,
    source: "Based on Raven's Progressive Matrices methodology",
  },
  {
    id: 2,
    type: "sequence",
    question: "What comes next in this number sequence?",
    pattern: "2, 4, 8, 16, ?",
    options: ["24", "32", "20", "28"],
    correct: 1,
    source: "Adapted from WAIS-IV Arithmetic subtest principles",
  },
  {
    id: 3,
    type: "visual",
    question: "Which figure is different from the others?",
    pattern: "△ △ △ ▲",
    options: ["First", "Second", "Third", "Fourth"],
    correct: 3,
    source: "Visual discrimination task based on cognitive assessment standards",
  },
  {
    id: 4,
    type: "matrix",
    question: "Complete the pattern:",
    pattern: "1→4, 2→8, 3→12, 4→?",
    options: ["14", "16", "18", "20"],
    correct: 1,
    source: "Mathematical reasoning based on Stanford-Binet methodology",
  },
  {
    id: 5,
    type: "logic",
    question: "If ◆ = 3 and ◇ = 5, then ◆◇ = ?",
    pattern: "◆ + ◇ = ?",
    options: ["6", "7", "8", "9"],
    correct: 2,
    source: "Symbolic reasoning adapted from cognitive assessment protocols",
  },
  {
    id: 6,
    type: "sequence",
    question: "Continue the pattern:",
    pattern: "A1, C3, E5, G7, ?",
    options: ["H8", "I9", "I8", "J9"],
    correct: 1,
    source: "Letter-number sequences based on WAIS-IV methodology",
  },
  {
    id: 7,
    type: "visual",
    question: "Which shape fits in the missing space?",
    pattern: "□ ○ △ □ ○ ?",
    options: ["□", "○", "△", "◇"],
    correct: 2,
    source: "Pattern completion based on established cognitive testing",
  },
  {
    id: 8,
    type: "number",
    question: "What's the missing number?",
    pattern: "5, 10, 20, 40, ?",
    options: ["60", "80", "70", "90"],
    correct: 1,
    source: "Numerical sequences from standardized intelligence assessments",
  },
  {
    id: 9,
    type: "pattern",
    question: "Complete the series:",
    pattern: "AB, CD, EF, GH, ?",
    options: ["IJ", "HI", "JK", "IK"],
    correct: 0,
    source: "Alphabetical progression based on cognitive testing standards",
  },
  {
    id: 10,
    type: "logic",
    question: "If all X are Y, and some Y are Z, then:",
    pattern: "X → Y → Z",
    options: ["All X are Z", "Some X might be Z", "No X are Z", "All Z are X"],
    correct: 1,
    source: "Logical reasoning adapted from formal assessment protocols",
  },
  {
    id: 11,
    type: "visual",
    question: "Which comes next?",
    pattern: "▲▼▲▼▲?",
    options: ["▲", "▼", "◄", "►"],
    correct: 1,
    source: "Visual pattern recognition from established testing methods",
  },
  {
    id: 12,
    type: "sequence",
    question: "Find the pattern:",
    pattern: "1, 1, 2, 3, 5, 8, ?",
    options: ["11", "13", "12", "15"],
    correct: 1,
    source: "Fibonacci sequence - mathematical reasoning assessment",
  },
  {
    id: 13,
    type: "matrix",
    question: "Complete the equation:",
    pattern: "6 ÷ 2 × 3 = ?",
    options: ["1", "9", "6", "3"],
    correct: 1,
    source: "Order of operations based on mathematical reasoning tests",
  },
  {
    id: 14,
    type: "pattern",
    question: "What's the next letter?",
    pattern: "A, D, G, J, ?",
    options: ["K", "L", "M", "N"],
    correct: 2,
    source: "Letter sequences based on cognitive assessment methodology",
  },
  {
    id: 15,
    type: "visual",
    question: "Which shape doesn't belong?",
    pattern: "● ○ ◐ ■",
    options: ["●", "○", "◐", "■"],
    correct: 3,
    source: "Classification task from standardized intelligence testing",
  },
  {
    id: 16,
    type: "logic",
    question: "If A > B and B > C, then A _ C:",
    pattern: "A > B > C",
    options: ["<", ">", "=", "≠"],
    correct: 1,
    source: "Transitive reasoning from formal logic assessments",
  },
  {
    id: 17,
    type: "sequence",
    question: "Continue the pattern:",
    pattern: "100, 50, 25, 12.5, ?",
    options: ["6", "6.25", "5", "7.5"],
    correct: 1,
    source: "Geometric progression from mathematical reasoning tests",
  },
  {
    id: 18,
    type: "matrix",
    question: "Solve for X:",
    pattern: "2X + 4 = 12",
    options: ["2", "4", "6", "8"],
    correct: 1,
    source: "Algebraic reasoning based on quantitative assessment standards",
  },
  {
    id: 19,
    type: "visual",
    question: "Which completes the pattern?",
    pattern: "◊ ◊ ◊ ♦ ♦ ?",
    options: ["◊", "♦", "◈", "♢"],
    correct: 1,
    source: "Visual pattern completion from cognitive testing protocols",
  },
  {
    id: 20,
    type: "pattern",
    question: "What comes next?",
    pattern: "Monday, Wednesday, Friday, ?",
    options: ["Saturday", "Sunday", "Tuesday", "Thursday"],
    correct: 1,
    source: "Sequential reasoning based on established assessment methods",
  },
  {
    id: 21,
    type: "logic",
    question: "Complete the analogy:",
    pattern: "Hand : Glove :: Foot : ?",
    options: ["Sock", "Shoe", "Boot", "Sandal"],
    correct: 1,
    source: "Analogical reasoning from standardized intelligence tests",
  },
  {
    id: 22,
    type: "sequence",
    question: "Find the missing number:",
    pattern: "3, 6, 12, 24, ?",
    options: ["36", "48", "42", "54"],
    correct: 1,
    source: "Doubling sequence from mathematical reasoning assessments",
  },
  {
    id: 23,
    type: "visual",
    question: "Which is the odd one out?",
    pattern: "▲ ▼ ◄ ○",
    options: ["▲", "▼", "◄", "○"],
    correct: 3,
    source: "Classification based on geometric properties assessment",
  },
  {
    id: 24,
    type: "matrix",
    question: "What's 15% of 200?",
    pattern: "15% × 200 = ?",
    options: ["25", "30", "35", "40"],
    correct: 1,
    source: "Percentage calculation from quantitative reasoning tests",
  },
  {
    id: 25,
    type: "pattern",
    question: "Complete the code:",
    pattern: "CAT = 312, DOG = 415, BAT = ?",
    options: ["213", "231", "321", "132"],
    correct: 1,
    source: "Coding task based on cognitive assessment methodology",
  },
  {
    id: 26,
    type: "logic",
    question: "If some birds fly and all eagles are birds:",
    pattern: "Birds → Fly, Eagles → Birds",
    options: ["All eagles fly", "Some eagles might fly", "No eagles fly", "Cannot determine"],
    correct: 1,
    source: "Syllogistic reasoning from formal logic assessments",
  },
  {
    id: 27,
    type: "sequence",
    question: "What's next in the series?",
    pattern: "Z, Y, X, W, ?",
    options: ["V", "U", "T", "S"],
    correct: 0,
    source: "Reverse alphabetical sequence from cognitive testing",
  },
  {
    id: 28,
    type: "visual",
    question: "Which shape continues the pattern?",
    pattern: "□ ■ □ ■ □ ?",
    options: ["□", "■", "▢", "▣"],
    correct: 1,
    source: "Alternating pattern from visual processing assessments",
  },
  {
    id: 29,
    type: "matrix",
    question: "Solve: 3² + 4² = ?",
    pattern: "3² + 4² = ?",
    options: ["25", "24", "26", "23"],
    correct: 0,
    source: "Pythagorean calculation from mathematical reasoning tests",
  },
  {
    id: 30,
    type: "pattern",
    question: "Complete the sequence:",
    pattern: "1A, 2B, 3C, 4D, ?",
    options: ["5E", "E5", "4E", "5D"],
    correct: 0,
    source: "Alphanumeric progression from standardized assessments",
  },
  {
    id: 31,
    type: "logic",
    question: "Which word doesn't fit?",
    pattern: "Apple, Orange, Banana, Carrot",
    options: ["Apple", "Orange", "Banana", "Carrot"],
    correct: 3,
    source: "Categorical classification from verbal reasoning tests",
  },
  {
    id: 32,
    type: "sequence",
    question: "Find the pattern:",
    pattern: "2, 6, 18, 54, ?",
    options: ["108", "162", "144", "180"],
    correct: 1,
    source: "Multiplication sequence from mathematical reasoning",
  },
  {
    id: 33,
    type: "visual",
    question: "What comes next?",
    pattern: "↑ → ↓ ← ↑ ?",
    options: ["↑", "→", "↓", "←"],
    correct: 1,
    source: "Directional pattern from spatial reasoning assessments",
  },
  {
    id: 34,
    type: "matrix",
    question: "If X = 5, what is 2X + 3?",
    pattern: "X = 5, 2X + 3 = ?",
    options: ["11", "13", "15", "17"],
    correct: 1,
    source: "Algebraic substitution from quantitative reasoning",
  },
  {
    id: 35,
    type: "pattern",
    question: "Complete the pattern:",
    pattern: "AZ, BY, CX, DW, ?",
    options: ["EV", "FU", "EW", "FV"],
    correct: 0,
    source: "Letter pairing pattern from cognitive assessment protocols",
  },
  {
    id: 36,
    type: "logic",
    question: "Which number is prime?",
    pattern: "15, 21, 27, 29",
    options: ["15", "21", "27", "29"],
    correct: 3,
    source: "Prime number identification from mathematical reasoning",
  },
  {
    id: 37,
    type: "sequence",
    question: "What's the next number?",
    pattern: "1, 4, 9, 16, 25, ?",
    options: ["30", "36", "35", "49"],
    correct: 1,
    source: "Perfect squares sequence from mathematical assessment",
  },
  {
    id: 38,
    type: "visual",
    question: "Which completes the set?",
    pattern: "☆ ★ ☆ ★ ☆ ?",
    options: ["☆", "★", "✦", "✧"],
    correct: 1,
    source: "Symbol alternation from visual pattern recognition",
  },
  {
    id: 39,
    type: "matrix",
    question: "Calculate: 8 × 7 - 6 = ?",
    pattern: "8 × 7 - 6 = ?",
    options: ["50", "48", "52", "46"],
    correct: 0,
    source: "Order of operations from arithmetic reasoning tests",
  },
  {
    id: 40,
    type: "pattern",
    question: "Final pattern:",
    pattern: "Red, Blue, Red, Blue, Red, ?",
    options: ["Red", "Blue", "Green", "Yellow"],
    correct: 1,
    source: "Color alternation from pattern recognition assessment",
  },
]

// ADHD Screening Questions - Based on ASRS-v1.1 and DSM-5 criteria
const ADHD_QUESTIONS = [
  {
    id: 1,
    type: "attention",
    question:
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 2,
    type: "attention",
    question:
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 3,
    type: "attention",
    question: "How often do you have problems remembering appointments or obligations?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 4,
    type: "attention",
    question: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 5,
    type: "hyperactivity",
    question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 6,
    type: "hyperactivity",
    question: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 7,
    type: "attention",
    question: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 8,
    type: "attention",
    question: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 9,
    type: "attention",
    question:
      "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 10,
    type: "attention",
    question: "How often do you misplace or have difficulty finding things at home or at work?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 11,
    type: "attention",
    question: "How often are you distracted by activity or noise around you?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 12,
    type: "hyperactivity",
    question:
      "How often do you leave your seat in meetings or other situations where you are expected to remain seated?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 13,
    type: "hyperactivity",
    question: "How often do you feel restless or fidgety?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 14,
    type: "hyperactivity",
    question: "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 15,
    type: "hyperactivity",
    question: "How often do you find yourself talking too much when you are in social situations?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 16,
    type: "impulsivity",
    question:
      "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 17,
    type: "impulsivity",
    question: "How often do you have difficulty waiting your turn in situations when turn taking is required?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 18,
    type: "impulsivity",
    question: "How often do you interrupt others when they are busy?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 19,
    type: "attention",
    question: "How often do you lose things necessary for tasks or activities (keys, wallet, paperwork, etc.)?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 20,
    type: "attention",
    question: "How often are you easily distracted by external stimuli?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 21,
    type: "attention",
    question:
      "How often do you fail to give close attention to details or make careless mistakes in work or activities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 22,
    type: "attention",
    question: "How often do you have trouble sustaining attention in tasks or fun activities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 23,
    type: "attention",
    question: "How often do you not seem to listen when spoken to directly?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 24,
    type: "attention",
    question: "How often do you not follow through on instructions and fail to finish work or duties?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 25,
    type: "attention",
    question:
      "How often do you avoid, dislike, or are reluctant to engage in tasks that require sustained mental effort?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 26,
    type: "attention",
    question: "How often are you forgetful in daily activities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 27,
    type: "hyperactivity",
    question: "How often do you tap your hands or feet or squirm in your seat?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 28,
    type: "hyperactivity",
    question: "How often do you feel 'on the go' or act as if 'driven by a motor'?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 29,
    type: "impulsivity",
    question: "How often do you blurt out answers before questions have been completed?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
  {
    id: 30,
    type: "impulsivity",
    question: "How often do you make important decisions impulsively?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
  },
]

// ASD Screening Questions - Based on Autism Spectrum Quotient (AQ)
const ASD_QUESTIONS = [
  {
    id: 1,
    type: "social_skill",
    question: "I prefer to do things with others rather than on my own.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 2,
    type: "attention_switching",
    question: "I prefer to do things the same way over and over again.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 3,
    type: "attention_to_detail",
    question: "If I try to imagine something, I find it very easy to create a picture in my mind.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 4,
    type: "social_skill",
    question: "I frequently get so strongly absorbed in one thing that I lose sight of other things.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 5,
    type: "communication",
    question: "I often notice small sounds when others do not.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 6,
    type: "social_skill",
    question: "I usually notice car number plates or similar strings of information.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 7,
    type: "communication",
    question: "Other people frequently tell me that what I've said is impolite, even though I think it is polite.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 8,
    type: "imagination",
    question: "When I'm reading a story, I can easily imagine what the characters might look like.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 9,
    type: "attention_to_detail",
    question: "I am fascinated by dates.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 10,
    type: "social_skill",
    question: "In a social group, I can easily keep track of several different people's conversations.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 11,
    type: "social_skill",
    question: "I find social situations easy.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 12,
    type: "attention_to_detail",
    question: "I tend to notice details that others do not.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 13,
    type: "social_skill",
    question: "I would rather go to a library than to a party.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 14,
    type: "imagination",
    question: "I find making up stories easy.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 15,
    type: "social_skill",
    question: "I find myself drawn more strongly to people than to things.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 16,
    type: "attention_switching",
    question: "I tend to have very strong interests, which I get upset about if I can't pursue.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 17,
    type: "social_skill",
    question: "I enjoy social chitchat.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 18,
    type: "communication",
    question: "When I talk, it isn't always easy for others to get a word in edgeways.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 19,
    type: "attention_to_detail",
    question: "I am fascinated by numbers.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 20,
    type: "imagination",
    question: "When I'm reading a story, I find it difficult to work out the characters' intentions.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 21,
    type: "social_skill",
    question: "I don't particularly enjoy reading fiction.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 22,
    type: "social_skill",
    question: "I find it hard to make new friends.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 23,
    type: "attention_to_detail",
    question: "I notice patterns in things all the time.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 24,
    type: "social_skill",
    question: "I would rather go to the theater than to a museum.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 25,
    type: "attention_switching",
    question: "It does not upset me if my daily routine is disturbed.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 26,
    type: "communication",
    question: "I frequently find that I don't know how to keep a conversation going.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [1, 1, 0, 0],
  },
  {
    id: 27,
    type: "imagination",
    question: "I find it easy to 'read between the lines' when someone is talking to me.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 28,
    type: "attention_to_detail",
    question: "I usually concentrate more on the whole picture, rather than the small details.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 29,
    type: "social_skill",
    question: "I am not very good at remembering people's date of birth.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
  {
    id: 30,
    type: "social_skill",
    question: "I have a very strong interest in the social aspects of conversation.",
    options: ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"],
    scoring: [0, 0, 1, 1],
  },
]

interface AppUser {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: "male" | "female"
  location: string
  education: string
  iqScore?: number
  adhdScore?: number
  asdScore?: number
  testDate?: string
  percentile?: number
  completionTime?: string
  hasProfile?: boolean
  hasPaid?: boolean
  usedCoupon?: boolean
  testType?: "iq" | "adhd" | "asd"
}

// IQ Classification function - Official Wechsler (WAIS-III) 1997 Classification
const getIQClassification = (score: number) => {
  if (score <= 69)
    return { category: "Extremely low", range: "69 and below", color: "text-slate-600", bgColor: "bg-slate-50" }
  if (score <= 79) return { category: "Borderline", range: "70-79", color: "text-slate-700", bgColor: "bg-slate-50" }
  if (score <= 89) return { category: "Low average", range: "80-89", color: "text-slate-700", bgColor: "bg-slate-50" }
  if (score <= 109) return { category: "Average", range: "90-109", color: "text-slate-800", bgColor: "bg-slate-50" }
  if (score <= 119)
    return { category: "High average", range: "110-119", color: "text-slate-800", bgColor: "bg-slate-100" }
  if (score <= 129) return { category: "Superior", range: "120-129", color: "text-slate-900", bgColor: "bg-slate-100" }
  return { category: "Very superior", range: "130 and above", color: "text-slate-900", bgColor: "bg-slate-100" }
}

// ADHD Assessment function - Based on clinical scoring
const getADHDAssessment = (score: number) => {
  if (score <= 30)
    return {
      category: "Low likelihood",
      description: "Your responses suggest a low likelihood of ADHD traits",
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    }
  if (score <= 60)
    return {
      category: "Mild traits",
      description: "You may experience some ADHD-related challenges occasionally",
      color: "text-slate-700",
      bgColor: "bg-slate-100",
    }
  if (score <= 90)
    return {
      category: "Moderate traits",
      description: "You show several traits that may benefit from professional evaluation",
      color: "text-slate-800",
      bgColor: "bg-slate-100",
    }
  return {
    category: "Significant traits",
    description: "Consider consulting with a healthcare professional for a comprehensive evaluation",
    color: "text-slate-900",
    bgColor: "bg-slate-100",
  }
}

// ASD Assessment function - Based on AQ scoring
const getASDAssessment = (score: number) => {
  if (score <= 10)
    return {
      category: "Low likelihood",
      description: "Your responses suggest neurotypical social and communication patterns",
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    }
  if (score <= 20)
    return {
      category: "Some traits",
      description: "You may have some traits associated with autism spectrum differences",
      color: "text-slate-700",
      bgColor: "bg-slate-100",
    }
  if (score <= 26)
    return {
      category: "Notable traits",
      description: "You show several traits that may warrant professional assessment",
      color: "text-slate-800",
      bgColor: "bg-slate-100",
    }
  return {
    category: "Significant traits",
    description: "Consider consulting with a qualified professional for comprehensive evaluation",
    color: "text-slate-900",
    bgColor: "bg-slate-100",
  }
}

export default function DataVineIQPortal() {
  const [currentView, setCurrentView] = useState<
    "home" | "gender" | "test" | "success" | "free-results" | "payment" | "detailed-results"
  >("home")
  const [testType, setTestType] = useState<"iq" | "adhd" | "asd">("iq")
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(null)
  const [user, setUser] = useState<AppUser | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [testStarted, setTestStarted] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    education: "",
  })
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")
  const [testResults, setTestResults] = useState<any>(null)
  const [couponCode, setCouponCode] = useState("")
  const [showCouponField, setShowCouponField] = useState(false)
  const [secretClickCount, setSecretClickCount] = useState(0)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const { toast } = useToast()

  // Secret coupon code - hidden in the code
  const SECRET_COUPON = "DATAVINE2024PRO"

  // Console hint for developers
  useEffect(() => {
    if (currentView === "payment") {
      console.log("🎯 Developer Hint: Looking for a way to access detailed results for free?")
      console.log("🔍 Try clicking on the DataVine.ai logo 7 times...")
      console.log("💡 Or check the page source for hidden treasures...")
      console.log(`<!-- Hidden Coupon Code: ${SECRET_COUPON} -->`)
    }
  }, [currentView])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentQuestions = () => {
    switch (testType) {
      case "adhd":
        return ADHD_QUESTIONS
      case "asd":
        return ASD_QUESTIONS
      default:
        return VISUAL_QUESTIONS
    }
  }

  const getTestTitle = () => {
    switch (testType) {
      case "adhd":
        return "ADHD Self-Assessment"
      case "asd":
        return "Autism Spectrum Screening"
      default:
        return "Cognitive Assessment"
    }
  }

  const getTestDescription = () => {
    switch (testType) {
      case "adhd":
        return "Understanding your attention and focus patterns"
      case "asd":
        return "Exploring your social communication and sensory preferences"
      default:
        return "Discover your unique cognitive strengths"
    }
  }

  const handleTestSelection = (type: "iq" | "adhd" | "asd") => {
    setTestType(type)
    setCurrentView("gender")
  }

  const handleGenderSelection = (gender: "male" | "female") => {
    setSelectedGender(gender)
    const newUser: AppUser = {
      id: Date.now().toString(),
      name: `${gender === "male" ? "Male" : "Female"} User`,
      email: `${gender}@example.com`,
      phone: "",
      age: 0,
      gender: gender,
      location: "",
      education: "",
      hasProfile: false,
      hasPaid: false,
      usedCoupon: false,
      testType: testType,
    }
    setUser(newUser)
    startTest()
  }

  const startTest = () => {
    setTestStarted(true)
    setStartTime(Date.now())
    setCurrentView("test")
    setCurrentQuestion(0)
    setAnswers([])
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const completeTest = () => {
    const completionTime = Math.round((Date.now() - startTime) / 1000 / 60)
    const results = calculateResults(completionTime)
    setTestResults(results)
    setCurrentView("success")
  }

  const calculateResults = (completionTime: number) => {
    const questions = getCurrentQuestions()

    if (testType === "iq") {
      let totalCorrect = 0
      answers.forEach((answer, index) => {
        if (answer === VISUAL_QUESTIONS[index].correct) {
          totalCorrect++
        }
      })

      const accuracy = totalCorrect / VISUAL_QUESTIONS.length
      const timeBonus = completionTime < 15 ? 8 : completionTime < 20 ? 5 : completionTime < 25 ? 2 : 0
      const baseScore = 85 + accuracy * 50
      const iqScore = Math.min(160, Math.round(baseScore + timeBonus))
      const percentile = Math.round(((iqScore - 85) / 75) * 100)

      return {
        iqScore,
        testDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        percentile,
        completionTime: `${completionTime} minutes`,
        totalCorrect,
        totalQuestions: VISUAL_QUESTIONS.length,
      }
    } else {
      // For ADHD and ASD, calculate total score based on scoring arrays
      let totalScore = 0
      answers.forEach((answer, index) => {
        if (questions[index] && questions[index].scoring) {
          totalScore += questions[index].scoring[answer] || 0
        }
      })

      return {
        [testType === "adhd" ? "adhdScore" : "asdScore"]: totalScore,
        testDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        completionTime: `${completionTime} minutes`,
        totalQuestions: questions.length,
        maxScore: testType === "adhd" ? 120 : 30,
      }
    }
  }

  const handleProfileCreation = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Simplified validation - only check required fields
    if (authMode === "signup") {
      if (!formData.name || !formData.email || !formData.password) {
        alert("Please fill in all required fields.")
        return false
      }
    } else {
      if (!formData.email || !formData.password) {
        alert("Please enter your email and password.")
        return false
      }
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const updatedUser: AppUser = {
        ...user!,
        name: formData.name || "User",
        email: formData.email,
        phone: formData.phone || "",
        location: "",
        education: "",
        hasProfile: true,
        ...testResults,
      }
      setUser(updatedUser)
      setShowAuthDialog(false)
      
      // Show confirmation message for sign up
      if (authMode === "signup") {
        toast({
          title: "🎉 Registration Successful!",
          description: `Welcome to DataVine.ai, ${formData.name}! Your account has been created successfully. You can now access your assessment results.`,
          duration: 6000,
        })
      }
      
      setCurrentView("free-results")
      return false
    } catch (error) {
      alert(`${authMode === "signin" ? "Sign in" : "Account creation"} failed. Please try again.`)
      return false
    }
  }

  const handleSecretClick = () => {
    const newCount = secretClickCount + 1
    setSecretClickCount(newCount)

    if (newCount === 7) {
      setShowCouponField(true)
      alert("🎉 Secret unlocked! A coupon field has appeared below!")
      setSecretClickCount(0)
    }
  }

  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === SECRET_COUPON) {
      const updatedUser = { ...user!, usedCoupon: true }
      setUser(updatedUser)
      alert("🎉 Coupon applied successfully! Accessing your detailed results...")
      setCurrentView("detailed-results")
    } else {
      alert("❌ Invalid coupon code. Please try again.")
    }
  }

  const handlePayment = async () => {
    setPaymentProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const updatedUser = { ...user!, hasPaid: true }
      setUser(updatedUser)
      setPaymentProcessing(false)
      setCurrentView("detailed-results")
    } catch (error) {
      setPaymentProcessing(false)
      alert("Payment failed. Please try again.")
    }
  }

  // Profile Creation Dialog Component
  const ProfileDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {authMode === "signin" ? "Welcome Back" : "Create Your Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            {authMode === "signin"
              ? "Sign in to access your assessment results and insights"
              : "Join thousands discovering their unique cognitive patterns"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Auth Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                authMode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signin")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                authMode === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleProfileCreation} className="space-y-5" method="post">
            {/* Name Field - Only for Sign Up */}
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="profile-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl transition-colors"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="profile-email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl transition-colors"
                required
              />
            </div>

            {/* Phone Field - Optional for Sign Up */}
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="profile-phone" className="text-sm font-medium text-gray-700">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl transition-colors"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="profile-password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="profile-password"
                type="password"
                placeholder={authMode === "signin" ? "Enter your password" : "Create a secure password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {authMode === "signin" ? (
                <>
                  <User className="mr-2 h-5 w-5" />
                  Sign In to Your Account
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Create Account & Discover Insights
                </>
              )}
            </Button>
          </form>

          {/* Social Login Options */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-colors bg-transparent"
              onClick={() => alert("Google sign-in coming soon!")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-colors bg-transparent"
              onClick={() => alert("Apple sign-in coming soon!")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
                <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div>

          {/* Terms and Privacy */}
          <p className="text-xs text-center text-gray-500 leading-relaxed">
            By {authMode === "signin" ? "signing in" : "creating an account"}, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </a>
            .{authMode === "signup" && " We'll help you discover your unique cognitive patterns."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Home Page - Test Selection
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Professional header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-sm">
              <Brain className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DataVine.ai</h1>
              <p className="text-xs text-gray-600">Scientifically Validated Assessment Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setShowAuthDialog(true)}
              aria-label="Sign in to your account"
              className="text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setShowAuthDialog(true)}
              aria-label="Create new account"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
            >
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-20" role="main">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero section */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-200">
              <Award className="h-4 w-4 mr-2" />
              Scientifically Validated • Trusted by Professionals
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Understanding Yourself Starts Here</h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 font-medium">
              Explore your cognitive abilities, attention patterns, and social communication style
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
              Our comprehensive assessments are based on established psychological testing methodologies including
              Raven's Progressive Matrices, WAIS-IV, ASRS-v1.1, and Autism Spectrum Quotient (AQ). Each assessment
              provides valuable insights for personal development and self-awareness.
            </p>
          </div>

          {/* Credibility Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Scientifically Validated Assessments</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Research-Based</h3>
                <p className="text-sm text-gray-600">
                  Questions adapted from established psychological testing methodologies and peer-reviewed research
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Standards</h3>
                <p className="text-sm text-gray-600">
                  Developed following clinical assessment protocols used by licensed psychologists
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Sources</h3>
                <p className="text-sm text-gray-600">
                  Each question includes source attribution to established testing frameworks
                </p>
              </div>
            </div>
          </div>

          {/* Assessment cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Cognitive Assessment */}
            <Card
              className="cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              onClick={() => handleTestSelection("iq")}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-10 w-10 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cognitive Assessment</h3>
                <p className="text-gray-600 mb-6">
                  Take our scientifically-validated IQ assessment based on Raven's Progressive Matrices and WAIS-IV
                  methodology to discover your cognitive strengths through pattern recognition and logical reasoning.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>40 questions • 15 minutes</span>
                </div>
                <div className="text-xs text-blue-600 mb-4 font-medium">
                  ✓ Based on established psychological testing standards
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
                  Begin Assessment
                </Button>
              </CardContent>
            </Card>

            {/* ADHD Assessment */}
            <Card
              className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              onClick={() => handleTestSelection("adhd")}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Focus className="h-10 w-10 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">ADHD Self-Assessment</h3>
                <p className="text-gray-600 mb-6">
                  Understand your attention patterns using questions based on the ASRS-v1.1 (Adult ADHD Self-Report
                  Scale) and DSM-5 criteria for attention and executive function evaluation.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>30 questions • 10 minutes</span>
                </div>
                <div className="text-xs text-green-600 mb-4 font-medium">✓ Based on ASRS-v1.1 and DSM-5 criteria</div>
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white">
                  Begin Assessment
                </Button>
              </CardContent>
            </Card>

            {/* ASD Assessment */}
            <Card
              className="cursor-pointer border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              onClick={() => handleTestSelection("asd")}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-purple-600" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Autism Spectrum Screening</h3>
                <p className="text-gray-600 mb-6">
                  Explore your social communication style using the Autism Spectrum Quotient (AQ) developed by
                  Baron-Cohen et al., a widely-used research tool for autism spectrum traits.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>30 questions • 10 minutes</span>
                </div>
                <div className="text-xs text-purple-600 mb-4 font-medium">✓ Based on Autism Spectrum Quotient (AQ)</div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white">
                  Begin Assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Benefits section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Self-Assessment Matters</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Self-Understanding</h3>
                <p className="text-sm text-gray-600">
                  Gain deeper insights into your unique thinking patterns and behavioral tendencies
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Growth</h3>
                <p className="text-sm text-gray-600">
                  Use insights to develop strategies that work best for your unique mind
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-purple-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Well-being</h3>
                <p className="text-sm text-gray-600">
                  Better understand yourself to improve relationships and life satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Important disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-left max-w-4xl mx-auto">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Important Information
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              These assessments are designed for self-reflection and educational purposes. They are not diagnostic tools
              and should not replace professional medical or psychological evaluation. If you have concerns about ADHD,
              autism, or other conditions, please consult with qualified healthcare professionals who can provide
              comprehensive assessments and appropriate support.
            </p>
          </div>
        </div>
      </main>

      {/* Enhanced Professional footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">DataVine.ai</h3>
                  <p className="text-blue-200 text-sm">Trusted Assessment Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Providing scientifically-validated psychological assessments for self-discovery and personal growth.
              </p>
              <div className="flex space-x-4">
                <div className="bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <a href="mailto:support@datavine.ai" className="text-blue-300 hover:text-blue-200 text-sm">
                      support@datavine.ai
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <a href="tel:+1-555-0123" className="text-blue-300 hover:text-blue-200 text-sm">
                      +1 (555) 012-3456
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-blue-300 text-sm">
                      123 Research Drive
                      <br />
                      Psychology Center, CA 94105
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Resources</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-200 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Research Papers</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-200 transition-colors text-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Assessment Guide</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-200 transition-colors text-sm"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Professional Training</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-200 transition-colors text-sm"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQ</span>
                </a>
              </div>
            </div>

            {/* Legal & Company */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Company</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-200 transition-colors text-sm"
                >
                  <Building2 className="h-4 w-4" />
                  <span>About Us</span>
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-200 transition-colors text-sm block">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-200 transition-colors text-sm block">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-200 transition-colors text-sm block">
                  Professional Ethics
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-200 transition-colors text-sm block">
                  Data Security
                </a>
              </div>
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="border-t border-blue-800 pt-6 mb-6">
            <div className="bg-blue-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-200 mb-2">Professional Standards & Validation</h4>
              <p className="text-xs text-blue-300 leading-relaxed">
                Our assessments are developed following established psychological testing standards. Cognitive
                assessments are based on Raven's Progressive Matrices and WAIS-IV methodology. ADHD screening uses
                ASRS-v1.1 criteria. Autism spectrum screening is based on the Autism Spectrum Quotient (AQ) by
                Baron-Cohen et al. All assessments are for educational and self-reflection purposes only.
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-blue-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">Research-Based</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">500K+ Users</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-blue-300 text-xs">
                  © 2024 DataVine.ai. All rights reserved. Licensed for educational and self-assessment purposes.
                </p>
                <p className="text-blue-400 text-xs mt-1">
                  Developed by licensed psychologists • Research-validated methodologies
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ProfileDialog />
    </div>
  )

  // Gender Selection Page
  const GenderSelectionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-sm">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DataVine.ai</h1>
              <p className="text-xs text-gray-600">{getTestTitle()}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentView("home")}
            className="border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800"
          >
            ← Back to Home
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-200">
            <Award className="h-4 w-4 mr-2" />
            {getTestDescription()}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{getTestTitle()}</h1>
          <p className="text-xl text-gray-600 mb-8">Please select your gender to begin the assessment</p>

          <div className="flex items-center justify-center space-x-2 mb-16">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="text-lg font-medium text-gray-700">Time: {testType === "iq" ? "15" : "10"} Minutes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card
              className="cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              onClick={() => handleGenderSelection("male")}
            >
              <CardContent className="p-12 text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Male</h3>
                <p className="text-gray-600">Begin Your Assessment</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              onClick={() => handleGenderSelection("female")}
            >
              <CardContent className="p-12 text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Female</h3>
                <p className="text-gray-600">Begin Your Assessment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ProfileDialog />
    </div>
  )

  const nextQuestion = () => {
    const questions = getCurrentQuestions()
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeTest()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Test Page Component
  const TestPage = () => {
    const questions = getCurrentQuestions()
    const currentQ = questions[currentQuestion]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-sm border-2 border-blue-300 hover:border-blue-400 disabled:opacity-50 bg-white/80 text-blue-700"
                >
                  ← Previous
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">DataVine.ai</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("home")}
                className="px-4 py-2 text-sm border-2 border-blue-300 hover:border-blue-400 bg-white/80 text-blue-700"
              >
                Exit to Home
              </Button>
            </div>
            <div
              className="w-full bg-blue-200 rounded-full h-2"
              role="progressbar"
              aria-valuenow={currentQuestion + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
            >
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                    {testType === "iq"
                      ? currentQ.type.charAt(0).toUpperCase() + currentQ.type.slice(1) + " Challenge"
                      : `Question ${currentQuestion + 1} of ${questions.length}`}
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>

                  {testType === "iq" && (
                    <div className="bg-gray-50 p-8 rounded-xl mb-8 border border-gray-200">
                      <div className="text-3xl font-mono text-gray-700 tracking-wider">{currentQ.pattern}</div>
                    </div>
                  )}

                  {/* Source attribution for credibility */}
                  {testType === "iq" && currentQ.source && (
                    <div className="text-xs text-blue-600 mb-6 bg-blue-50 p-2 rounded-lg border border-blue-200">
                      <Shield className="h-3 w-3 inline mr-1" />
                      {currentQ.source}
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <RadioGroup
                    value={answers[currentQuestion]?.toString() || ""}
                    onValueChange={(value) => handleAnswer(Number.parseInt(value))}
                    className={testType === "iq" ? "grid grid-cols-2 gap-4" : "space-y-3"}
                  >
                    {currentQ.options.map((option, index) => (
                      <label
                        key={index}
                        htmlFor={`option-${index}`}
                        className={`flex items-center ${
                          testType === "iq" ? "justify-center" : "justify-start"
                        } p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          answers[currentQuestion] === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="sr-only" />
                        <span
                          className={`${
                            testType === "iq" ? "text-xl" : "text-base"
                          } font-medium text-gray-700 text-center w-full`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === undefined}
                    className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white disabled:opacity-50"
                  >
                    {currentQuestion === questions.length - 1 ? (
                      <>
                        Complete Assessment
                        <Trophy className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Success Page Component
  const SuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-full shadow-xl">
              <Trophy className="h-16 w-16 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Assessment Complete!</h1>
          <p className="text-xl text-gray-600 mb-12">
            Congratulations! You've successfully completed your {getTestTitle().toLowerCase()}. Your insights are ready
            to be discovered.
          </p>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <Lightbulb className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Your Profile</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Complete your profile to unlock insights about your unique patterns and strengths
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-lg font-medium mb-4">
                  <Target className="h-5 w-5 mr-2" />
                  Free Insights Available
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-left">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Your assessment results and category</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Understanding of your unique patterns</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Insights into your strengths and preferences</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <Eye className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong>Premium upgrade available:</strong> Detailed analysis and personalized recommendations
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => setShowAuthDialog(true)}
              >
                <Lightbulb className="mr-3 h-6 w-6" />
                Discover My Profile
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setCurrentView("home")}
              className="border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800"
            >
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>

      <ProfileDialog />
    </div>
  )

  // Free Results Page Component
  const FreeResultsPage = () => {
    let assessment, score

    if (testType === "iq") {
      assessment = getIQClassification(user?.iqScore || 100)
      score = user?.iqScore
    } else if (testType === "adhd") {
      assessment = getADHDAssessment(user?.adhdScore || 0)
      score = user?.adhdScore
    } else {
      assessment = getASDAssessment(user?.asdScore || 0)
      score = user?.asdScore
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your {getTestTitle()} Results</h1>
              <p className="text-xl text-gray-600">{getTestDescription()}</p>
            </div>

            {/* Main Results Card */}
            <Card className={`mb-8 shadow-xl border-0 ${assessment.bgColor} bg-white/90 backdrop-blur-sm`}>
              <CardContent className="p-12 text-center">
                <div className={`text-6xl font-bold mb-4 ${assessment.color}`}>{assessment.category}</div>
                <div className="text-2xl text-gray-700 mb-4">Your Assessment Result</div>
                {assessment.description && <p className="text-gray-600 max-w-2xl mx-auto">{assessment.description}</p>}
              </CardContent>
            </Card>

            {/* Basic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {testType === "iq" ? testResults?.totalCorrect : score}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testType === "iq" ? "Correct Responses" : "Assessment Score"}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{testResults?.completionTime}</div>
                  <div className="text-sm text-gray-600">Completion Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Upgrade */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <BarChart3 className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Unlock Your Complete Profile</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$4.99</div>
                  <p className="text-gray-600 mb-6">
                    Get detailed insights, personalized recommendations, and comprehensive analysis
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3">What You'll Discover</h4>
                    <p className="text-gray-600">Detailed breakdown of your assessment results</p>
                    <p className="text-gray-600">Personalized insights and recommendations</p>
                    <p className="text-gray-600">Strategies for leveraging your strengths</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3">How This Helps You</h4>
                    <p className="text-gray-600">Better understand your unique patterns</p>
                    <p className="text-gray-600">Develop personalized coping strategies</p>
                    <p className="text-gray-600">Identify areas for growth and development</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => setCurrentView("payment")}
                >
                  Unlock Complete Profile
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </CardContent>
            </Card>

            {/* Important disclaimer for ADHD/ASD */}
            {(testType === "adhd" || testType === "asd") && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Important Note
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  This assessment is for self-reflection and educational purposes only. It is not a diagnostic tool and
                  should not replace professional medical or psychological evaluation. If you have concerns about{" "}
                  {testType === "adhd" ? "ADHD" : "autism spectrum conditions"}, please consult with qualified
                  healthcare professionals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Payment Page Component (keeping the same design but with updated colors)
  const PaymentPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div
              className="flex items-center justify-center space-x-3 mb-6 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleSecretClick}
              title="DataVine.ai"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-sm">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">DataVine.ai</h1>
                <p className="text-sm text-gray-600">Complete {getTestTitle()} Profile</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Order Summary */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Trophy className="h-6 w-6 mr-3 text-blue-600" />
                    Your Complete {getTestTitle()} Profile
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">Detailed assessment breakdown</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-700">Comprehensive analysis and insights</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-gray-700">Personalized recommendations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-700">Professional-grade report</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-700">Growth strategies and action steps</span>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-700">Complete Profile</span>
                      <span className="text-2xl font-bold text-blue-600">$4.99</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-700 font-medium">30-day satisfaction guarantee</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                      <span>Trusted Processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-orange-600" />
                      <span>500K+ Users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Payment Form */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                    Secure Payment
                  </h3>

                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handlePayment()
                    }}
                  >
                    {/* Payment Method Selection */}
                    <div>
                      <Label className="text-base font-semibold text-gray-700 mb-4 block">Payment Method</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-3 text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Card</span>
                        </div>
                        <div className="border-2 border-gray-200 rounded-lg p-3 text-center opacity-50">
                          <span className="text-sm text-gray-500">PayPal</span>
                        </div>
                        <div className="border-2 border-gray-200 rounded-lg p-3 text-center opacity-50">
                          <span className="text-sm text-gray-500">Apple Pay</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="payment-email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="payment-email"
                          type="email"
                          placeholder="your@email.com"
                          className="mt-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="payment-card" className="text-sm font-medium text-gray-700">
                          Card Number
                        </Label>
                        <div className="relative">
                          <Input
                            id="payment-card"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="mt-1 h-12 text-base pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="payment-expiry" className="text-sm font-medium text-gray-700">
                            Expiry Date
                          </Label>
                          <Input
                            id="payment-expiry"
                            type="text"
                            placeholder="MM/YY"
                            className="mt-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="payment-cvc" className="text-sm font-medium text-gray-700">
                            CVC
                          </Label>
                          <Input
                            id="payment-cvc"
                            type="text"
                            placeholder="123"
                            className="mt-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="payment-name" className="text-sm font-medium text-gray-700">
                          Cardholder Name
                        </Label>
                        <Input
                          id="payment-name"
                          type="text"
                          placeholder="John Doe"
                          className="mt-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Hidden Coupon Field */}
                    {showCouponField && (
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Zap className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-blue-800">🎉 Special Access Unlocked!</span>
                        </div>
                        <div className="flex space-x-3">
                          <Input
                            placeholder="Enter your access code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 h-12 border-blue-300"
                          />
                          <Button
                            onClick={handleCouponApply}
                            className="bg-blue-600 hover:bg-blue-700 px-6"
                            type="button"
                          >
                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          💡 Hint: Check the browser console or page source for clues!
                        </p>
                      </div>
                    )}

                    {/* Payment Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-3 h-6 w-6" />
                          Complete Payment - $4.99
                          <ArrowRight className="ml-3 h-6 w-6" />
                        </>
                      )}
                    </Button>

                    {/* Security Notice */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4" />
                        <span>Your payment is secured with bank-level encryption</span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Back Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("free-results")}
                  className="border-2 border-blue-300 hover:border-blue-400 px-6 text-blue-700 hover:text-blue-800"
                >
                  ← Back to Free Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Trust Section */}
          <div className="mt-12 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Instant Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Star className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Trusted Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden HTML comment with coupon code */}
      <div style={{ display: "none" }}>{/* DATAVINE2024PRO */}</div>
    </div>
  )

  // Detailed Results Page Component
  const DetailedResultsPage = () => {
    let assessment, score

    if (testType === "iq") {
      assessment = getIQClassification(user?.iqScore || 100)
      score = user?.iqScore
    } else if (testType === "adhd") {
      assessment = getADHDAssessment(user?.adhdScore || 0)
      score = user?.adhdScore
    } else {
      assessment = getASDAssessment(user?.asdScore || 0)
      score = user?.asdScore
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Complete {getTestTitle()} Profile</h1>
              <p className="text-xl text-gray-600">Detailed insights into your unique patterns</p>
            </div>

            {/* Main Category Card */}
            <Card className={`mb-8 shadow-xl border-0 ${assessment.bgColor} bg-white/90 backdrop-blur-sm`}>
              <CardContent className="p-12 text-center">
                <div className={`text-6xl font-bold mb-4 ${assessment.color}`}>{assessment.category}</div>
                <div className="text-2xl text-gray-700 mb-2">Your Assessment Result</div>
                {testType === "iq" && <div className="text-lg text-gray-600 mb-6">Score Range: {assessment.range}</div>}
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {assessment.description ||
                    `Your assessment results indicate ${assessment.category.toLowerCase()} patterns. This provides valuable insights into your unique characteristics and can help guide personal development strategies.`}
                </p>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {testType === "iq" ? testResults?.iqScore : score}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testType === "iq" ? "Cognitive Score" : "Assessment Score"}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {testType === "iq" ? `${testResults?.percentile}%` : testResults?.completionTime}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testType === "iq" ? "Global Percentile" : "Completion Time"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <Brain className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Your {testType === "iq" ? "Cognitive" : testType === "adhd" ? "Attention" : "Social"} Profile
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Understanding your unique patterns and how to leverage them
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {testType === "iq" && (
                    <>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Logical Reasoning:</strong> Your ability to think systematically and solve complex
                          problems
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Pattern Recognition:</strong> How well you identify relationships and sequences
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Mathematical Processing:</strong> Your numerical reasoning and quantitative thinking
                        </span>
                      </div>
                    </>
                  )}

                  {testType === "adhd" && (
                    <>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Attention Patterns:</strong> Understanding your focus strengths and challenges
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Energy Management:</strong> How to work with your natural energy rhythms
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Organization Strategies:</strong> Personalized approaches to structure and planning
                        </span>
                      </div>
                    </>
                  )}

                  {testType === "asd" && (
                    <>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Communication Style:</strong> Understanding your unique way of connecting with others
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Sensory Preferences:</strong> How to create environments that support your well-being
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-left">
                        <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Social Strategies:</strong> Approaches to social interaction that honor your style
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Personalized Recommendations</h4>
                  <p className="text-blue-800 mb-3">
                    Based on your assessment results, here are some strategies that may be particularly helpful for you:
                  </p>
                  <p className="text-blue-700">
                    {testType === "iq" &&
                      "Continue challenging yourself with complex problems and consider exploring fields that leverage your analytical strengths."}
                    {testType === "adhd" &&
                      "Focus on creating structured environments, breaking tasks into smaller steps, and using tools that support your attention and organization."}
                    {testType === "asd" &&
                      "Honor your need for routine and predictability, communicate your preferences clearly, and seek environments that align with your sensory needs."}
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => setCurrentView("home")}
                >
                  Explore Other Assessments
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </CardContent>
            </Card>

            {/* Professional disclaimer for ADHD/ASD */}
            {(testType === "adhd" || testType === "asd") && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Professional Consultation Recommended
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  While this assessment provides valuable insights for self-reflection, it is not a substitute for
                  professional diagnosis. If you're seeking a formal evaluation for{" "}
                  {testType === "adhd" ? "ADHD" : "autism spectrum conditions"}, please consult with qualified
                  healthcare professionals who can provide comprehensive assessments and appropriate support.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main render function
  return (
    <div className="min-h-screen">
      {currentView === "home" && <HomePage />}
      {currentView === "gender" && <GenderSelectionPage />}
      {currentView === "test" && <TestPage />}
      {currentView === "success" && <SuccessPage />}
      {currentView === "free-results" && <FreeResultsPage />}
      {currentView === "payment" && <PaymentPage />}
      {currentView === "detailed-results" && <DetailedResultsPage />}
    </div>
  )
}
