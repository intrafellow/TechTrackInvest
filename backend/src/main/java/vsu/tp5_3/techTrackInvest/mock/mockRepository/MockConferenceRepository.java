package vsu.tp5_3.techTrackInvest.mock.mockRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vsu.tp5_3.techTrackInvest.filters.CategoryFilter;
import vsu.tp5_3.techTrackInvest.mock.mockEntities.MockConference;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MockConferenceRepository {
    private final List<MockConference> list = List.of(
            new MockConference("1", "Name1", "Ds", 1),
            new MockConference("2", "Name2", "Ds", 2),
            new MockConference("3", "Name3", "Ds", 1),
            new MockConference("4", "Name4", "Ds", 3));
    public List<MockConference> findAll() {
        return list;
    }

    public List<MockConference> findAllForFilter(CategoryFilter filter) {
        if (filter.id() != null) {
            return list.stream().filter(a -> a.getCategoryId().equals(filter.id())).toList();
        }
        return list;
    }

    public Optional<MockConference> findById(String id) {
        return list.stream().filter(a -> a.getId().equals(id)).findFirst();
    }
}
