import {priorities, types} from "../constants.js";
import {Faker, uk} from '@faker-js/faker'

export const generateStatements =  (limit) => {

    const faker = new Faker({
        locale: uk
    })

    const statements = []

    for (let i  = 0; i < limit; i++){
        const statement = {
            id: i + 1,
            name: `Заявка №${i + 1}`,
            type: faker.helpers.arrayElement(types),
            priority: faker.helpers.arrayElement(priorities),
            createdAt: faker.date.between({from: new Date('2000-05-01'), to: new Date('2025-11-04')}),
            client: faker.person.fullName(),
        };

        statements.push(statement)
    }

    return statements
}