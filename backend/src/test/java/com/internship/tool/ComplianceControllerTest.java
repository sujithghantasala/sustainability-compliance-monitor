package com.internship.tool;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.controller.ComplianceController;
import com.internship.tool.controller.GlobalExceptionHandler;
import com.internship.tool.entity.ComplianceRecord;
import com.internship.tool.repository.ComplianceRepository;
import com.internship.tool.service.AiServiceClient;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ComplianceControllerTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private ComplianceRepository repository;
    private AiServiceClient aiServiceClient;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ComplianceRepository.class);
        aiServiceClient = Mockito.mock(AiServiceClient.class);

        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(new ComplianceController(repository, aiServiceClient))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void getAllReturnsActiveRecords() throws Exception {
        when(repository.findByDeletedFalseOrderByCreatedAtDesc()).thenReturn(List.of(record(1L)));

        mockMvc.perform(get("/api/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].companyName").value("GreenGrid Manufacturing"));
    }

    @Test
    void getByIdReturnsNotFoundForMissingRecord() throws Exception {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Record not found"));
    }

    @Test
    void createValidRecordReturnsCreated() throws Exception {
        ComplianceRecord record = record(null);
        when(repository.save(any(ComplianceRecord.class))).thenAnswer(invocation -> {
            ComplianceRecord saved = invocation.getArgument(0);
            saved.setId(2L);
            return saved;
        });

        mockMvc.perform(post("/api/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    void createInvalidRecordReturnsBadRequest() throws Exception {
        ComplianceRecord record = record(null);
        record.setCompanyName("");
        record.setComplianceScore(140);

        mockMvc.perform(post("/api/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }

    @Test
    void updateValidRecordReturnsOk() throws Exception {
        ComplianceRecord existing = record(1L);
        ComplianceRecord updated = record(1L);
        updated.setComplianceScore(95);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(ComplianceRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(put("/api/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.complianceScore").value(95));
    }

    @Test
    void deleteSoftDeletesRecord() throws Exception {
        ComplianceRecord existing = record(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(ComplianceRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(delete("/api/1"))
                .andExpect(status().isNoContent());

        verify(repository).save(Mockito.argThat(record -> Boolean.TRUE.equals(record.getDeleted())));
    }

    @Test
    void searchReturnsOk() throws Exception {
        when(repository.findByDeletedFalseOrderByCreatedAtDesc()).thenReturn(List.of(record(1L)));

        mockMvc.perform(get("/api/search")
                        .param("q", "green")
                        .param("status", "COMPLIANT")
                        .param("from", "2026-05-01")
                        .param("to", "2026-05-10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("COMPLIANT"));
    }

    @Test
    void exportReturnsCsvAttachment() throws Exception {
        when(repository.findByDeletedFalseOrderByCreatedAtDesc()).thenReturn(List.of(record(1L)));

        mockMvc.perform(get("/api/export"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("records.csv")))
                .andExpect(content().string(containsString("GreenGrid Manufacturing")));
    }

    @Test
    void uploadAcceptsCsv() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "records.csv", "text/csv", "name\nA".getBytes());

        mockMvc.perform(multipart("/api/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("File uploaded successfully"));
    }

    @Test
    void uploadRejectsInvalidType() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "records.txt", "application/json", "{}".getBytes());

        mockMvc.perform(multipart("/api/upload").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Only CSV uploads are allowed"));
    }

    @Test
    void aiRequestValidatesInput() throws Exception {
        mockMvc.perform(post("/api/ai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("inputText", ""))))
                .andExpect(status().isBadRequest());
    }

    private ComplianceRecord record(Long id) {
        ComplianceRecord record = new ComplianceRecord();
        record.setId(id);
        record.setCompanyName("GreenGrid Manufacturing");
        record.setComplianceScore(92);
        record.setStatus("COMPLIANT");
        record.setDescription("Renewable electricity contracts are active.");
        record.setDeleted(false);
        record.setCreatedAt(LocalDateTime.of(2026, 5, 1, 9, 0));
        return record;
    }
}
