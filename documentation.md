# Documentation & Design Decisions

T3 stack serves as a quick and easy approach to quickly scaffold a full stack application as it already comes bundles with the latest essential tools required to build out something fast.


#### Features Available

1. Search functionality which provides an initial dropdown list to see available job titles
2. Further search feature to see results with related job titles
3. Paginated view of results (and history if you wish to navigate back and to)
4. Each `Badge` or job title item in colour is clickable to auto search with that job title
5. Clerk login authentication (you can only search after logging in)


#### API

`/searchByName`
```typescript
data: {
    results: [
        id: number
        name: string
        pdlCount: number
        relatedTitles: [
            id: number
            relatedTitle: {
                id: number
                name: string
                pdlCount: number
            }
            relatedTitleId: number
            titleId: number
        ]
    ]
    total: number
}
```

`/search`
```typescript
data: {
    results: [
        id: number
        name: string
        pdlCount: number
    ]
}
```


#### Thoughts and Revisions

 - We have implemented 2 different api routes as they serve a slightly different functionality. Perhaps this could be more smart given more thought and time however given one is meant to be a quick lookup for job title search information and the other for a deeper join with related job titles, I think they should serve their pusposes well for this context.
 - Ideally more granularity with the components would be preferred as they become easier to manager and offer more flexibility. Likewise, it is easier for other engineers to digest components and files when analysing them. Probably there would exist best practices and everyone would be used to them.
 - Making a more logical and powerful util for managing search params would make sense, having them strongly typed and flexible to be modified in future if we decide to add further features
 - BE database pov better consideration of normalisation and filtering as a fundamental step
    - reduce data redundancy
    - data consistency
    - better query performance

 
#### Large Dataset Performance:
- Given a large dataset and to avoid api, ui and ux performance issues, `pagination` and splitting up of the data has been considered. Only a fixed amount (10) of records can be returned in any given moment with respective pagination buttons applied for the user to further search through remaining results.
- a larger implementation could consider things like `elastic search` which is usually a great option for searching with huge data sets
 - an improvement here could be enabling some flexibility for the user to select how many items they wish to see per page, so a ui component to facilitate the change and reflect in the be api
 - Other things such as handling `loading states` have been considered such as disabling further search/api calls while a call is being made behind the scenes. This will prevent lag and any unnecessary requests that can overload the be services.
 - Likewise, `api cancellation` can be further considered as an improvement here as well, whereby if a user makes an initial search but then decides to change their mind, the in progress api call can be cancelled and a new one made. The ui would need to also support this functionality so they would go hand in hand, if enabling interaction is still permitted during api calls.
 - `debouncing` is a common feature when implementing search and real time data updates. Instead of making an api call for every keystroke using the `onChange` method of an input field, we can debounce to allow a few ms for when the user will pause after they have finished typing. Also it gives them time to think, if they need to pause and then continue typing then we are not making unnecessary api calls. I have used a search button for example for the deeper search which helps to avoid the above scenario - where the user has to make a conscious decision to submit their search input rather than it happening automatically.

 #### Interactivity
 - Once the user starts searching, they are very easily able to jump between different job titles and their relations. Each job title results will contain clickable relation job titles of which the user can further search if they wish to. Removes the need to type out something which already exists for them on screen and serves a better purpose than just visual.


 #### Deployment and Hosting Solutions
 - `Vercel` is a great option for hosting FE applications, especially as it is usually recommended for Next.js apps with some of its optimisations that are available. Likewise, for simplicity and speed it makes sense to get something configured and up and running fast.
 - `Supabase` is a great option for hosting the BE of an application. It supports postgresql databases out the box which suits our stack perfectly, with many more features like authentication, edge functions and great tooling integration when thinking about the lifetime of a project. Likewise it is also very simple to setup and works fast.

 There are many options for tooling and platforms so rather than a lack of options, it can be more about if a specific feature or tool is vital that may decide the option to decide on.
 

 #### Potential Features
 There can be many additions made to improve the functionality of the application.
 - With authentication, we can have features like saving favourite options, history of searches and profile based information
 - Session expiry
 - Likewise, if this is say an internal tool then we can make available more CRUD options for a user signed in. One could add for example related job titles to those main titles that don't have any.


#### Testing
- Where relevant component level testing for larger integrations would be considered and implemented
- e2e integration tests


### Tooling

- TRPC
    - easy to use lightweight tyoe-safe api framework for building a full stack app without needing the typical rest or graphql api layer. Built in Zod is also great for validation, with auto type inference
    - works great with react-query to manage api calls, handling efficient data fetching with useQuery and built in error/retry handling
    - supports serverless frameworks/platforms, much of what we are using Next, Vercel etc.