class BaseUserDto {
  public id: string;
  public email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
}

export default BaseUserDto;
