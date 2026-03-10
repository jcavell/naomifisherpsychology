export enum Category {
  Autism = "Autism and Neurodiversity",
  DemandAvoidance = "Demand Avoidance",
  SchoolAndEducation = "School and Education",
  MentalHealthAndBehaviour = "Mental Health and Behaviour",
}

export class Subcategory {
  static readonly Autism_Essentials = new Subcategory(Category.Autism, "Essentials");
  static readonly Autism_Anxiety = new Subcategory(Category.Autism, "Anxiety");
  static readonly Autism_Anger = new Subcategory(Category.Autism, "Anger");
  static readonly Autism_Transitions = new Subcategory(
    Category.Autism,
    "Transitions",
  );

  static readonly DA_Essentials = new Subcategory(
    Category.DemandAvoidance,
    "Essentials",
  );
  static readonly DA_AnxietyAndChange = new Subcategory(
    Category.DemandAvoidance,
    "Anxiety and Change",
  );

  static readonly DA_LowDemandParenting = new Subcategory(
    Category.DemandAvoidance,
    "Art of Low Demand Parenting",
  );

  static readonly School_School = new Subcategory(
    Category.SchoolAndEducation,
    "School",
  );
  static readonly School_OutOfSchool = new Subcategory(
    Category.SchoolAndEducation,
    "Out of School",
  );
  static readonly School_SEND = new Subcategory(
    Category.SchoolAndEducation,
    "SEND",
  );
  static readonly School_EHCPs = new Subcategory(
    Category.SchoolAndEducation,
    "EHCPs",
  );

  static readonly MHB_AnxietyAndOCD = new Subcategory(
    Category.MentalHealthAndBehaviour,
    "Anxiety and OCD",
  );
  static readonly MHB_Burnout = new Subcategory(
    Category.MentalHealthAndBehaviour,
    "Burnout",
  );
  static readonly MHB_Trauma = new Subcategory(
    Category.MentalHealthAndBehaviour,
    "Trauma",
  );
  static readonly MHB_Screens = new Subcategory(
    Category.MentalHealthAndBehaviour,
    "Screens",
  );

  private constructor(
    readonly category: Category,
    readonly displayName: string,
  ) {}

  get categoryDisplayName(): string {
    return this.category as string;
  }
}
