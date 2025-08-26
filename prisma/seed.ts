import { IMAGE_BASE_URL, MAX_AGE, MIN_AGE } from "@/lib/data/constants";
import { faker } from "@faker-js/faker";
import {
  Client,
  ClientMembershipType,
  PrismaClient,
  User,
} from "@prisma/client";
import { subMonths } from "date-fns";

const prisma = new PrismaClient();
const CLIENT_COUNT = 600;
const SPECIALIST_COUNT = 600;

async function main() {
  try {
    await createClients();
  } catch (e: unknown) {
    console.error("Error during client creation:", e);
  }

  try {
    await createSpecialists();
  } catch (e: unknown) {
    console.error("Error during specialist creation:", e);
  }

  try {
    await createReviewsForSpecialists();
  } catch (e: unknown) {
    console.error("Error during review seeding:", e);
  }

  try {
    await createFavoritesForClients();
  } catch (e: unknown) {
    console.error("Error during favorites seeding:", e);
  }

  try {
    await createSpecialistSummaries();
  } catch (e: unknown) {
    console.error("Error during specialist summaries:", e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function createClients() {
  const existingClients = await prisma.client.count();
  const clientsToCreate = CLIENT_COUNT - existingClients;

  if (clientsToCreate <= 0) {
    console.log(
      `Already have ${existingClients} clients. No additional clients need to be created.`
    );
    return;
  }
  console.log(`Creating ${clientsToCreate} clients...`);
  for (let i = 0; i < clientsToCreate; i++) {
    let user: User | null = null;
    try {
      const createdAt = getRandomDateWithMonthsAgo(getRandomNumber(12, 60));
      const updatedAt = getRandomDateWithMonthsAgo(getRandomNumber(3, 11));
      const sex = faker.person.sex();
      const name = faker.person.firstName(sex as "male" | "female");
      // create user account
      user = await prisma.user.create({
        data: {
          createdAt: createdAt,
          updatedAt: updatedAt,
          role: "CLIENT",
          authProviderId: faker.string.uuid(),
        },
      });
      let client: Client | null = null;
      if (user) {
        // create client
        client = await prisma.client.create({
          data: {
            createdAt: createdAt,
            updatedAt: updatedAt,
            userId: user.id,
          },
        });
      }
      if (client) {
        const membershipType = getRandomMembershipType();
        if (membershipType) {
          const membershipEndDate = getRandomEndDateAfter(createdAt, 1); // at least 1 month after createdAt

          await prisma.clientMembership.create({
            data: {
              createdAt, // align with client creation
              membershipStartDate: createdAt, // starts at client createdAt
              membershipEndDate, // random end date >= +1 month
              membershipType, // enum value
              client: { connect: { id: client.id } }, // link to client
            },
          });
        }
      }
      console.log(`Created client number: ${i + 1}`);
    } catch (e) {
      console.error(`Error creating Client ${existingClients + i + 1}:`, e);

      // Delete the user if it was created but the client creation failed
      if (user) {
        try {
          await prisma.user.delete({
            where: {
              id: user.id,
            },
          });
          console.log(`Deleted user with ID: ${user.id}`);
        } catch (deleteError) {
          console.error(`Error deleting user with ID: ${user.id}`, deleteError);
        }
      }
    }
  }
  console.log(`Created ${clientsToCreate} clients.`);
}

async function createSpecialists() {
  const existing = await prisma.specialist.count();
  const toCreate = SPECIALIST_COUNT - existing;

  if (toCreate <= 0) {
    console.log(
      `Already have ${existing} specialist. No additional specialist need to be created.`
    );
    return;
  }
  console.log(`Creating ${toCreate} specialist...`);
  for (let i = 0; i < toCreate; i++) {
    let user: User | null = null;
    try {
      const createdAt = getRandomDateWithMonthsAgo(getRandomNumber(12, 60));
      const updatedAt = getRandomDateWithMonthsAgo(getRandomNumber(3, 11));
      const sex = faker.person.sex();
      const name = faker.person.firstName(sex as "male" | "female");
      // create user account
      user = await prisma.user.create({
        data: {
          createdAt: createdAt,
          updatedAt: updatedAt,
          role: "SPECIALIST",
          authProviderId: faker.string.uuid(),
        },
      });
      if (user) {
        // create specialist

        const allIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shuffled = allIds.sort(() => Math.random() - 0.5);
        const chosen = shuffled.slice(0, faker.number.int({ min: 1, max: 4 }));

        const specialist = await prisma.specialist.create({
          data: {
            createdAt: createdAt,
            updatedAt: updatedAt,
            userId: user.id,
            name,
            genderId: sex === "male" ? 2 : 1,
            yearOfBirth: getRandomNumber(
              new Date().getFullYear() - MAX_AGE,
              new Date().getFullYear() - MIN_AGE
            ),
            bio: faker.lorem.paragraphs(3, "\n\n"),
            specialtyIds: chosen,
          },
        });
        if (specialist) {
          const photoCount = 3;
          const gender = sex === "male" ? "male" : "female";
          const photos = Array.from({ length: photoCount }).map((_, idx) => ({
            url: faker.image
              .personPortrait({ sex: gender, size: 512 })
              .replace(IMAGE_BASE_URL, ""),
            priority: idx + 1,
            createdAt,
            updatedAt,
            specialistId: specialist.id,
          }));

          await prisma.specialistPhoto.createMany({
            data: photos,
          });
          // Create a Contact row first
          const provinceNumber = getRandomWeightedProvinceId();

          // Get the province name using provinceNumber for mapping with `citiesByProvince`
          const provinceName = Object.keys(provinceMap).find(
            (key) =>
              provinceMap[key as keyof typeof provinceMap] === provinceNumber
          ) as keyof typeof citiesByProvince;
          const cityList = citiesByProvince[provinceName] ?? [];
          const randomCity =
            cityList[Math.floor(Math.random() * cityList.length)];

          const contact = await prisma.contact.create({
            data: {
              createdAt,
              updatedAt,
              provinceId: provinceNumber,
              location1: randomCity,
              location2: faker.location.street(),
              location3: faker.location.streetAddress(),
            },
          });

          // Link the specialist to this contact
          await prisma.specialist.update({
            where: { id: specialist.id },
            data: { contactId: contact.id },
          });

          // Helper to pick a single primary index when count > 0
          const pickPrimaryIndex = (count: number) =>
            count > 0 ? faker.number.int({ min: 0, max: count - 1 }) : -1;

          // PHONES: 1–3, exactly one primary
          const phonesCount = faker.number.int({ min: 1, max: 3 });
          const phonePrimaryIdx = pickPrimaryIndex(phonesCount);
          await prisma.contactPhone.createMany({
            data: Array.from({ length: phonesCount }).map((_, i) => ({
              createdAt,
              // keep numbers globally unique-ish; adjust as you like
              phone: generateRandomSAMobileNumber(),
              primary: i === phonePrimaryIdx,
              verified: i === phonePrimaryIdx ? true : faker.datatype.boolean(),
              contactId: contact.id,
            })),
          });

          // EMAILS: 1–3, exactly one primary
          const emailsCount = faker.number.int({ min: 1, max: 3 });
          const emailPrimaryIdx = pickPrimaryIndex(emailsCount);
          await prisma.contactEmail.createMany({
            data: Array.from({ length: emailsCount }).map((_, i) => ({
              createdAt,
              email: faker.internet.email({ firstName: name }).toLowerCase(),
              primary: i === emailPrimaryIdx,
              verified: i === phonePrimaryIdx ? true : faker.datatype.boolean(),
              contactId: contact.id,
            })),
          });

          // WEBSITES: 0–2, exactly one primary if any
          const websitesCount = faker.number.int({ min: 0, max: 2 });
          const websitePrimaryIdx = pickPrimaryIndex(websitesCount);
          if (websitesCount > 0) {
            await prisma.contactWebsite.createMany({
              data: Array.from({ length: websitesCount }).map((_, i) => ({
                createdAt,
                website: faker.internet.url(),
                primary: i === websitePrimaryIdx,
                verified:
                  i === phonePrimaryIdx ? true : faker.datatype.boolean(),
                contactId: contact.id,
              })),
            });
          }
        }
        console.log(`Created specialist number: ${i + 1}`);
      }
    } catch (e) {
      console.error(`Error creating Specialist ${existing + i + 1}:`, e);

      // Delete the user if it was created but the specialist creation failed
      if (user) {
        try {
          await prisma.user.delete({
            where: {
              id: user.id,
            },
          });
          console.log(`Deleted user with ID: ${user.id}`);
        } catch (deleteError) {
          console.error(`Error deleting user with ID: ${user.id}`, deleteError);
        }
      }
    }
  }
  console.log(`Created ${toCreate} specialists.`);
}

async function createReviewsForSpecialists() {
  const clients = await prisma.client.findMany({ select: { id: true } });

  // specialists + which already have reviews
  const specialists = await prisma.specialist.findMany({
    select: { id: true, createdAt: true },
  });
  const reviewed = await prisma.review.groupBy({
    by: ["specialistId"],
    _count: { specialistId: true },
  });
  const reviewedIds = new Set(reviewed.map((r) => r.specialistId));

  if (clients.length === 0 || specialists.length === 0) {
    console.log("No clients or specialists found; skipping reviews.");
    return;
  }

  console.log(`Seeding reviews for specialists WITHOUT existing reviews...`);

  for (const [idx, spec] of specialists.entries()) {
    if (reviewedIds.has(spec.id)) continue; // ✅ skip if already has reviews

    const reviewCount = faker.number.int({ min: 0, max: 10 });
    const usedClientIds = new Set<number>();

    for (let r = 0; r < reviewCount; r++) {
      // unique client per specialist (best-effort)
      let clientId = faker.helpers.arrayElement(clients).id;
      let tries = 0;
      while (usedClientIds.has(clientId) && tries++ < 10) {
        clientId = faker.helpers.arrayElement(clients).id;
      }
      usedClientIds.add(clientId);

      const reviewCreatedAt = getRandomDateBetween(spec.createdAt, new Date());
      const reviewUpdatedAt = getRandomDateBetween(reviewCreatedAt, new Date());

      const review = await prisma.review.create({
        data: {
          createdAt: reviewCreatedAt,
          updatedAt: reviewUpdatedAt,
          review: faker.lorem.paragraph({ min: 1, max: 3 }),
          clientId,
          specialistId: spec.id,
        },
        select: { id: true },
      });

      const ratings = Array.from({ length: 5 }, (_, i) => ({
        reviewId: review.id,
        ratingOptionId: i + 1, // 1..5
        ratingOptionValue: faker.number.int({ min: 2, max: 5 }),
      }));

      await prisma.reviewRating.createMany({ data: ratings });
    }

    if ((idx + 1) % 10 === 0) {
      console.log(
        `Processed ${idx + 1} specialists (skipping those with reviews)...`
      );
    }
  }

  console.log("Finished seeding reviews (no duplicates).");
}

async function createFavoritesForClients() {
  const clients = await prisma.client.findMany({ select: { id: true } });
  const specialists = await prisma.specialist.findMany({
    select: { id: true },
  });

  if (clients.length === 0 || specialists.length === 0) {
    console.log("No clients or specialists found; skipping favorites.");
    return;
  }

  // Specialists that already have ANY favorite -> skip entirely
  const favored = await prisma.clientFavorite.groupBy({
    by: ["specialistId"],
    _count: { specialistId: true },
  });
  const skipSpecialistIds = new Set(favored.map((x) => x.specialistId));

  // Existing favorites (per client) to avoid duplicates
  const existing = await prisma.clientFavorite.findMany({
    select: { clientId: true, specialistId: true },
  });
  const existingByClient = new Map<number, Set<number>>();
  for (const { clientId, specialistId } of existing) {
    if (!existingByClient.has(clientId))
      existingByClient.set(clientId, new Set());
    existingByClient.get(clientId)!.add(specialistId);
  }

  console.log("Seeding favorites only for specialists with ZERO favorites...");

  for (const client of clients) {
    const taken = existingByClient.get(client.id) ?? new Set<number>();

    // candidates: specialists with zero favorites overall AND not already favorited by this client
    const candidates = specialists
      .map((s) => s.id)
      .filter((id) => !skipSpecialistIds.has(id) && !taken.has(id));

    if (candidates.length === 0) continue;

    const toAdd = faker.number.int({
      min: 0,
      max: Math.min(5, candidates.length),
    });
    if (toAdd === 0) continue;

    // shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const chosen = candidates.slice(0, toAdd);

    const now = new Date();
    await prisma.clientFavorite.createMany({
      data: chosen.map((specialistId) => ({
        createdAt: now,
        clientId: client.id,
        specialistId,
      })),
      skipDuplicates: true,
    });

    // update in-memory tracker
    let set = existingByClient.get(client.id);
    if (!set) {
      set = new Set<number>();
      existingByClient.set(client.id, set);
    }
    for (const id of chosen) set.add(id);
  }

  console.log(
    "Finished seeding favorites (no specialists with prior favorites were touched)."
  );
}

async function createSpecialistSummaries() {
  // only specialists missing a summary
  const specialists = await prisma.specialist.findMany({
    select: { id: true },
    where: { specialistSummary: null }, // ✅ skip those that already have a summary
  });

  if (specialists.length === 0) {
    console.log("All specialists already have summaries. Skipping.");
    return;
  }

  console.log(
    `Creating summaries for ${specialists.length} specialists (only missing ones)...`
  );

  for (const { id: specialistId } of specialists) {
    // counts
    const [favoritedByCount, reviewCount] = await prisma.$transaction([
      prisma.clientFavorite.count({ where: { specialistId } }),
      prisma.review.count({ where: { specialistId } }),
    ]);

    // overall average rating across ALL rating points
    const overall = await prisma.reviewRating.aggregate({
      where: { review: { specialistId } },
      _avg: { ratingOptionValue: true },
    });
    const averageRating = Number(overall._avg.ratingOptionValue ?? 0);

    // per-option averages
    const grouped = await prisma.reviewRating.groupBy({
      by: ["ratingOptionId"] as const,
      where: { review: { specialistId } },
      _avg: { ratingOptionValue: true },
    });

    // viewedCount: random once on create
    const viewedCount = faker.number.int({ min: 10, max: 200 });

    // CREATE (not upsert) because we know there is no summary yet
    const summary = await prisma.specialistSummary.create({
      data: {
        specialistId,
        favoritedByCount,
        viewedCount,
        reviewCount,
        averageRating,
      },
      select: { id: true },
    });

    // insert per-option rows
    if (grouped.length > 0) {
      await prisma.specialistRatingSummary.createMany({
        data: grouped.map((g) => ({
          specialistSummaryId: summary.id,
          ratingOptionId: g.ratingOptionId,
          averageValue: Number(g._avg.ratingOptionValue ?? 0),
        })),
        skipDuplicates: true,
      });
    }
  }

  console.log("Finished creating specialist summaries (only missing ones).");
}

function getRandomWeightedProvinceId() {
  return faker.helpers.arrayElement(weightedProvinceIds);
}

// Define the weighted list for province IDs based on desired distribution
const weightedProvinceIds: number[] = [
  // Gauteng (ID 1) x 5
  ...Array<number>(5).fill(1),
  // Natal (ID 2) x 5
  ...Array<number>(5).fill(2),
  // Western Cape (ID 3) x 5
  ...Array<number>(5).fill(3),
  // North West (ID 7) x 4
  ...Array<number>(4).fill(7),
  // Free State (ID 8) x 4
  ...Array<number>(4).fill(8),
  // Mpumalanga (ID 5) x 4
  ...Array<number>(4).fill(5),
  // Eastern Cape (ID 4) x 3
  ...Array<number>(3).fill(4),
  // Northern Cape (ID 9) x 3
  ...Array<number>(3).fill(9),
  // Limpopo (ID 6) x 3
  ...Array<number>(3).fill(6),
];

// Province and City Data
const provinceMap = {
  "Oos-Kaap": 4,
  Vrystaat: 8,
  Gauteng: 1,
  "KwaZulu-Natal": 2,
  Limpopo: 6,
  Mpumalanga: 5,
  "Noord-Kaap": 9,
  Noordwes: 7,
  "Wes-Kaap": 3,
};

const citiesByProvince = {
  "Oos-Kaap": ["Port Elizabeth", "East London", "Mthatha", "Graaff-Reinet"],
  Vrystaat: ["Bloemfontein", "Welkom", "Bethlehem", "Kimberley"],
  Gauteng: ["Johannesburg", "Pretoria", "Soweto", "Midrand"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle"],
  Limpopo: ["Polokwane", "Tzaneen", "Thohoyandou", "Phalaborwa"],
  Mpumalanga: ["Nelspruit", "Secunda", "Witbank", "Sabie"],
  "Noord-Kaap": ["Kimberley", "Upington", "Springbok", "De Aar"],
  Noordwes: ["Rustenburg", "Mahikeng", "Klerksdorp"],
  "Wes-Kaap": ["Cape Town", "Stellenbosch", "George"],
};

function generateRandomSAMobileNumber(): string {
  const prefixes = ["060", "071", "082", "061", "072", "083"];
  const prefix = faker.helpers.arrayElement(prefixes);
  return `${prefix}${faker.string.numeric(7)}`;
}

function getRandomDateWithMonthsAgo(monthsAgo: number) {
  const today = new Date();
  const pastDate = subMonths(today, monthsAgo);
  const randomDate = new Date(
    pastDate.getTime() + Math.random() * (today.getTime() - pastDate.getTime())
  );
  return randomDate;
}

function getRandomNumber(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

function getRandomMembershipType(): ClientMembershipType | null {
  const types: Array<ClientMembershipType | null> = [
    null,
    ClientMembershipType.FREE,
    ClientMembershipType.BASIC,
    ClientMembershipType.PREMIUM,
    ClientMembershipType.ALL_ACCESS,
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomEndDateAfter(startDate: Date, minMonthsLater = 1): Date {
  const monthsToAdd = getRandomNumber(minMonthsLater, 12);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsToAdd);
  return endDate;
}

function getRandomDateBetween(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const t = startMs + Math.random() * Math.max(1, endMs - startMs);
  return new Date(t);
}
