﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DartsApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Finished",
                table: "Matches",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Finished",
                table: "Matches");
        }
    }
}
