// // access.decorator.ts

// import {
//   createParamDecorator,
//   ExecutionContext,
//   Injectable,
// } from '@nestjs/common';
// import { CourseRepository } from 'src/routes/courses/infastructure/persistence/course.repository';
// import { UsersService } from 'src/routes/users/users.service';

// @Injectable()
// export class AccessCheckService {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly courseRepository: CourseRepository,
//   ) {}

//   async hasAccess(userId: number, courseId: number): Promise<boolean> {
//     // Implement access control logic based on userId and courseId
//     // Example: Check if the user is enrolled in the course
//     const user = await this.usersService.findOne({id:userId});
//     const course = await this.courseRepository.findOne({id:courseId});

//     if (!user || !course) {
//       return false;
//     }

//     // Perform access control logic based on user's enrollment or ownership of the course
//     // Example: Check if the user is the owner of the course or enrolled in it
//     // Implement your custom logic here based on your requirements

//     return true; // Return true if access is granted, false otherwise
//   }
// }

// export const AccessCheck = createParamDecorator(
//   async (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const userId = request.user.id; // Assuming userId is available in the authenticated user object
//     const courseId = data as string; // Assuming courseId is passed as decorator data

//     const accessCheckService = new AccessCheckService(
//       new UsersService(),
//       ctx.getCourseRepository(),
//     );

//     const hasAccess = await accessCheckService.hasAccess(userId, courseId);
//     return hasAccess;
//   },
// );
